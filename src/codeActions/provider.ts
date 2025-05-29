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

        // check if symbol already commented

        let symbolName = exactSymbol.name;
        if (exactSymbol.kind === vscode.SymbolKind.Method) {
            // special case for symbol.name = (*Some).Method
            symbolName = symbolName.substring(symbolName.indexOf('.') + 1);
        }

        const re = new RegExp(`\\/[/*]\\s*${symbolName}\\b`);

        const prevLine = document.lineAt(exactSymbol.range.start.line - 1).text;
        const prevLineMatches = re.test(prevLine);
        if (prevLineMatches) { return; }

        const curLineMatches = re.test(document.lineAt(exactSymbol.range.start.line).text);
        if (curLineMatches) { return; }

        const lastLineMatches = re.test(document.lineAt(exactSymbol.range.end.line).text);
        if (lastLineMatches) { return; }

        if (prevLine.endsWith('*/')) { return; }

        // end of check

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