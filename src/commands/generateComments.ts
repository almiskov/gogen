import * as vscode from "vscode";

export class GenerateCommentsCommand implements vscode.Command {
    public static readonly COMMAND_ID = 'gogen.generateComments';

    title: string = 'GoGen: Comments';
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

    // TODO: нужно допилить генерацию комментов для полей
    //  также допилить генерацию для мультикурсора через команду

    genComment(symbol: vscode.DocumentSymbol) {
        if (!symbol) {
            vscode.window.showInformationMessage('Command should be invoked via code action... TO BE...');
            return;
        }

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No active text editor');
            return;
        }

        const symbolStart = symbol.range.start;

        editor.edit(b => {
            b.insert(
                symbolStart.with({ line: symbolStart.line - 1 }),
                `\n// ${symbol.name} -`,
            );
        });
    }
}