import * as vscode from "vscode";

export class GenerateConstructorCommand implements vscode.Command {
    public static readonly COMMAND_ID = 'gogen.generateConstructor';

    title: string = 'GoGen: Constructor';
    command: string = GenerateConstructorCommand.COMMAND_ID;
    tooltip?: string | undefined;
    arguments?: any[] | undefined;

    register(context: vscode.ExtensionContext): void {
        context.subscriptions.push(
            vscode.commands.registerCommand(
                GenerateConstructorCommand.COMMAND_ID,
                (symbol: vscode.DocumentSymbol): void => this.genConstructor(symbol)
            )
        );
    }

    genConstructor(symbol: vscode.DocumentSymbol): void {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const ctorName = `New${symbol.name.charAt(0).toUpperCase() + symbol.name.substring(1)}`;

        const comment: string = `// ${ctorName} -`;
        const args: string[] = [];
        const fields: string[] = [];
        const ctor: string[] = [];

        if (symbol.children.length === 0) {
            ctor.push(
                comment,
                `func ${ctorName}() *${symbol.name} {`,
                `\treturn &${symbol.name}{}`,
                `}`
            );
        } else {
            for (const field of symbol.children) {
                const name = this.loweredName(field.name);

                args.push(`${name} ${field.detail}`);
                fields.push(`${field.name}: ${name}`);
            }

            ctor.push(
                comment,
                `func ${ctorName}(${args.join(', ')}) *${symbol.name} {`,
                `\treturn &${symbol.name}{`,
                ...fields.map(f => `\t\t${f},`),
                `\t}`,
                `}`
            );
        }

        editor.edit(b => {
            b.insert(symbol.range.end, '\n'),
                b.insert(
                    symbol.range.end.with({ line: symbol.range.end.line + 1 }),
                    ctor.join('\n') + '\n',
                );
        });
    }

    loweredName(name: string): string {
        let lowCapitalsIDx = name.length;

        for (let i = 0; i < name.length; i++) {
            const char = name.charAt(i);
            if (char === char.toUpperCase()) {
                continue;
            }
            lowCapitalsIDx = i - 1;
            break;
        }

        return lowCapitalsIDx === name.length ?
            name.toLowerCase() :
            name.substring(0, lowCapitalsIDx).toLowerCase() + name.substring(lowCapitalsIDx);
    }
}