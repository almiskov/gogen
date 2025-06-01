import * as vscode from 'vscode';
import { GenerateCommentsCommand } from './commands/generateComments';
import { CodeActionsProvider } from './codeActions/provider';
import { GenerateConstructorCommand } from './commands/generateConstructor';
import { GenerateMethodCommand } from './commands/generateMethod';

export function activate(context: vscode.ExtensionContext) {
	const generateCommentsCommand = new GenerateCommentsCommand();
	generateCommentsCommand.register(context);
	
	const generateConstructorCommand = new GenerateConstructorCommand();
	generateConstructorCommand.register(context);
	
	const generateMethodCommand = new GenerateMethodCommand();
	generateMethodCommand.register(context);

	const actionsProvider = new CodeActionsProvider(
		generateCommentsCommand,
		generateConstructorCommand,
		generateMethodCommand,
	);
	actionsProvider.register(context);
}

export function deactivate() {}
