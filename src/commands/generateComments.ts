import * as vscode from "vscode";

export class GenerateCommentsCommand implements vscode.Command {
    public static readonly COMMAND_ID = 'gogen.generateComment';

    title: string = 'GoGen: Comment';
    command: string = GenerateCommentsCommand.COMMAND_ID;
    tooltip?: string | undefined;
    arguments?: any[] | undefined;

    register(context: vscode.ExtensionContext): void {
        context.subscriptions.push(
            vscode.commands.registerCommand(
                GenerateCommentsCommand.COMMAND_ID,
                (symbol: vscode.DocumentSymbol): void => this.genComment(symbol)
            )
        );
    }

    genComment(symbol: vscode.DocumentSymbol) {
        if (!symbol) {
            vscode.window.showInformationMessage('Command should be invoked via code action...');
            return;
        }

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        switch (symbol.kind) {
            case vscode.SymbolKind.Class:
            case vscode.SymbolKind.Struct:
            case vscode.SymbolKind.Interface:
            case vscode.SymbolKind.Function:
            case vscode.SymbolKind.Method:
                this.genCommentUpper(editor, symbol);
                break;

            case vscode.SymbolKind.Constant:
                // one line const?
                if (editor.document.lineAt(symbol.range.start).text.startsWith('const ')) {
                    this.genCommentUpper(editor, symbol);
                    break;
                }

                // multiline const!
                this.genCommentRight(editor, symbol);
                break;

            case vscode.SymbolKind.Field:
                this.genCommentRight(editor, symbol);
                break;

            default:
                this.genCommentUpper(editor, symbol);
                break;
        }
    }

    genCommentRight(editor: vscode.TextEditor, symbol: vscode.DocumentSymbol): void {
        const comment = " " + this.commentText(symbol);

        editor.edit(b => {
            b.insert(
                editor.document.lineAt(symbol.range.end).range.end,
                comment,
            );
        });
    }

    genCommentUpper(editor: vscode.TextEditor, symbol: vscode.DocumentSymbol): void {
        let comment = this.commentText(symbol) + '\n';
        const symbolLine = editor.document.lineAt(symbol.range.start);

        if (symbolLine.firstNonWhitespaceCharacterIndex === 0) {
            editor.edit(b => b.insert(symbol.range.start.with({ character: 0 }), comment));
            return;
        }

        comment += symbolLine.text.substring(0, symbolLine.firstNonWhitespaceCharacterIndex);

        editor.edit(b => {
            b.insert(
                symbol.range.start.with({
                    character: editor.document.lineAt(symbol.range.start).firstNonWhitespaceCharacterIndex
                }),
                comment,
            );
        });
    }

    commentText(symbol: vscode.DocumentSymbol): string {
        let name = symbol.name;
        if (symbol.kind === vscode.SymbolKind.Method) {
            name = name.substring(name.indexOf('.') + 1);
        }

        return `// ${name} -`;
    }
}