import * as vscode from "vscode";

export class GenerateMethodCommand implements vscode.Command {
    public static readonly COMMAND_ID = 'gogen.generateMethod';

    title: string = 'GoGen: Method';
    command: string = GenerateMethodCommand.COMMAND_ID;
    tooltip?: string | undefined;
    arguments?: any[] | undefined;

    register(context: vscode.ExtensionContext): void {
        context.subscriptions.push(
            vscode.commands.registerCommand(
                GenerateMethodCommand.COMMAND_ID,
                (symbol: vscode.DocumentSymbol, position: vscode.Position): void => this.prpareGenMethod(symbol, position)
            )
        );
    }

    prpareGenMethod(symbol: vscode.DocumentSymbol, position: vscode.Position): void {
        let placeholder: string;

        switch (symbol.kind) {
            case vscode.SymbolKind.Class:
                placeholder = `Method name for ${symbol.name}`;
                break;

            case vscode.SymbolKind.Struct:
                placeholder = `Method name for *${symbol.name}`;
                break;

            default:
                vscode.window.showInformationMessage(`Unsupported symbol kind ${vscode.SymbolKind[symbol.kind]} to generate method`);
                return;
        }

        const methodNameInput = vscode.window.createInputBox();

        methodNameInput.placeholder = placeholder;

        methodNameInput.onDidAccept(() => {
            this.genMethod(methodNameInput.value.trim(), symbol, position);
            methodNameInput.hide();
        });
        methodNameInput.onDidHide(() => methodNameInput.dispose());

        methodNameInput.show();
    }

    genMethod(name: string, symbol: vscode.DocumentSymbol, position: vscode.Position): void {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const recv = symbol.kind === vscode.SymbolKind.Struct ?
            '*' + symbol.name :
            symbol.name;

        const recvVar = symbol.name.charAt(0).toLowerCase();

        const meth: string[] = [];
        let withComment = false;

        if (name.charAt(0) === name.charAt(0).toUpperCase()) {
            meth.push(`// ${name} -`);
            withComment = true;
        }

        const funcLine = `func (${recvVar} ${recv}) ${name}() {`;

        meth.push(
            funcLine,
            `\tpanic("unimplemented")`,
            `}`
        );

        editor.edit(b => b.insert(position, meth.join('\n')));

        const newCursorPosition = position.with({
            line: withComment ? position.line + 1 : position.line,
            character: funcLine.length - 3,
        });

        editor.selection = new vscode.Selection(newCursorPosition, newCursorPosition);
    }
}