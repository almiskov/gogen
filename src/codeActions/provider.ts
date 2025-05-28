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

        const actions: vscode.CodeAction[] = [];

        for (const symbol of symbols) {
            this.maybeAddGenCommentAction(actions, symbol, document, range);
        }

        return actions;
    }

    maybeAddGenCommentAction(actions: vscode.CodeAction[], symbol: vscode.DocumentSymbol, document: vscode.TextDocument, range: vscode.Range | vscode.Selection): void {
        if (!symbol.range.contains(range.start)) {
            return; 
        }

        let exactSymbol = symbol;

        const findExactSymbol = (parent: vscode.DocumentSymbol) => {
            if (parent.children.length === 0) {
                return;
            }

            for (const child of parent.children) {
                if (!child.range.contains(range.start)) {
                    continue;
                }
                exactSymbol = child;
                findExactSymbol(child);
            }
        };

        findExactSymbol(symbol);

        // TODO: проверить, что перед полем или после (!) нет
        //  и если нет, только тогда добавлять

        const action = new vscode.CodeAction(
            `Generate comment for ${exactSymbol.name}`,
            vscode.CodeActionKind.QuickFix,
        );

        action.command = {
            ...this.generateCommentsCommand,
            arguments: [exactSymbol]
        };

        actions.push(action);
    }
}