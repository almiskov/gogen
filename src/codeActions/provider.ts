import * as vscode from 'vscode';

export class CodeActionsProvider implements vscode.CodeActionProvider {
    private generateCommentsCommand: vscode.Command;

    constructor(generateCommentsCommand: vscode.Command) {
        this.generateCommentsCommand = generateCommentsCommand;
    }

    register(context: vscode.ExtensionContext): void {
        context.subscriptions.push(
            vscode.languages.registerCodeActionsProvider(
                'go', this, { providedCodeActionKinds: [vscode.CodeActionKind.Refactor] }
            )
        );
    }

    async provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): Promise<(vscode.CodeAction | vscode.Command)[] | null | undefined> {
        const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
            'vscode.executeDocumentSymbolProvider',
            document.uri
        );
        if (!symbols) { return; };

        const actions: (vscode.CodeAction[] | undefined) = [];

        for (const symbol of symbols) {
            if (this.shouldBeCommented(document, symbol, range.start)) {
                actions.push(this.createGenerateCommentActions(symbol));
            }
        }

        return actions;
    }


    shouldBeCommented(document: vscode.TextDocument, symbol: vscode.DocumentSymbol, cursor: vscode.Position): boolean {
        const cursorAtSymbol = symbol.range.contains(cursor);
        if (!cursorAtSymbol) {
            return false;
        }

        const alreadyCommented = document.lineAt(symbol.range.start.line - 1).text.includes(symbol.name);
        if (alreadyCommented) {
            return false;
        }

        return true;
    }

    createGenerateCommentActions(symbol: vscode.DocumentSymbol): vscode.CodeAction {
        const action = new vscode.CodeAction(
            `Generate comment for ${symbol.name}`,
            vscode.CodeActionKind.QuickFix,
        );

        action.command = {
            ...this.generateCommentsCommand,
            arguments: [symbol]
        };

        this.generateCommentsCommand.

        return action;
    }
}