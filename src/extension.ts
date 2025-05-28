import * as vscode from 'vscode';
import { GenerateCommentsCommand } from './commands/generateComments';
import { CodeActionsProvider } from './codeActions/provider';

export function activate(context: vscode.ExtensionContext) {
	const generateCommentsCommand = new GenerateCommentsCommand();
	generateCommentsCommand.register(context);

	const actionsProvider = new CodeActionsProvider(generateCommentsCommand);
	actionsProvider.register(context);
}

export function deactivate() {}
