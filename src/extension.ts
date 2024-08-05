// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
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
	const commentCommand = vscode.commands.registerCommand('gogen.comment', () => {
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

	const nameCharacter = RegExp('\w', 'g');

	const commentsCommand = vscode.commands.registerCommand('gogen.comments', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage('No active text editor');
			return;
		}

		editor.selections.forEach((selection) => {
			const lineText = editor.document.lineAt(selection.start.line).text;
			const cursor = selection.start;

			// find start of name

			let currentCharIndex = cursor.character;
			let currentChar = lineText.charAt(currentCharIndex);

			while (!nameCharacter.test(currentChar)) {

				// TODO: пройтись назад и вперёд до несовпадения с регуляркой
				//		так мы найдём начало и конец того, что является комментом

			}
		});
	});

	context.subscriptions.push(commentCommand, commentsCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
