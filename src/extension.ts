import * as vscode from 'vscode';
import comments from './comments/comments';

export function activate(context: vscode.ExtensionContext) {

	const commentsCommand = vscode.commands.registerCommand('gogen.comments', comments);

	context.subscriptions.push(commentsCommand);
}

// This method is called when your extension is deactivated
export function deactivate() { }
