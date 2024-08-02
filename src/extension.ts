// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { error } from 'console';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "gogen" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('gogen.comment', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user

		const editor = vscode.window.activeTextEditor;
		const selectedText = editor?.document.getText(editor.selection);
		const cursor = editor?.selection.active;

		if (selectedText?.length === 0) {
			vscode.window.showInformationMessage('nothing selected');
			return;
		}

		const comment = `\n// ${selectedText} -`;
		const commentPosition = cursor?.with(cursor.line - 1, 0);

		editor?.edit((builder) => {
			builder.insert(commentPosition!, comment);
		});
	});

	context.subscriptions.push(disposable);


}

// This method is called when your extension is deactivated
export function deactivate() {}
