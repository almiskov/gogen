import * as vscode from 'vscode';
import { GenerateCommentsCommand } from './commands/generateComments';
import { CodeActionsProvider } from './codeActions/provider';
import { GenerateConstructorCommand } from './commands/generateConstructor';

export function activate(context: vscode.ExtensionContext) {
	const generateCommentsCommand = new GenerateCommentsCommand();
	generateCommentsCommand.register(context);
	
	const generateConstructorCommand = new GenerateConstructorCommand();
	generateConstructorCommand.register(context);

	const actionsProvider = new CodeActionsProvider(generateCommentsCommand, generateConstructorCommand);
	actionsProvider.register(context);
}

export function deactivate() {}
