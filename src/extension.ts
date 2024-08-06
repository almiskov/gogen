import * as vscode from 'vscode';
import { DeclarationComment, formatDeclarationComment } from "./models";

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "gogen" is now active!');

	const declarationCharacter = new RegExp(`[a-zA-Z0-9_]`);

	const commentsCommand = vscode.commands.registerCommand('gogen.comments', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage('No active text editor');
			return;
		}

		// collecting comments

		const comments: DeclarationComment[] = [];

		editor.selections.forEach(selection => {
			const lineText = editor.document.lineAt(selection.start.line).text;
			const cursor = selection.start;

			// find start of name
			let startCharacterIndex, endCharacterIndex;

			// go backward
			let currentCharIndex = cursor.character;
			let currentChar = lineText.charAt(currentCharIndex);

			while (declarationCharacter.test(currentChar)) {
				startCharacterIndex = currentCharIndex;
				currentCharIndex--;
				currentChar = lineText.charAt(currentCharIndex);
			}

			// go forward
			currentCharIndex = cursor.character;
			currentChar = lineText.charAt(currentCharIndex);

			while (declarationCharacter.test(currentChar)) {
				currentChar = lineText.charAt(currentCharIndex);				
				endCharacterIndex = currentCharIndex;
				currentCharIndex++;
			}

			// got start and end

			comments.push({
				text: lineText.slice(startCharacterIndex, endCharacterIndex),
				line: selection.start.line,
				col: 0
			});
		});

		editor.edit(b => {
			comments.forEach(c => {
				b.insert(new vscode.Position(c.line, c.col), formatDeclarationComment(c));
			});
		});
	});

	context.subscriptions.push(commentsCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
