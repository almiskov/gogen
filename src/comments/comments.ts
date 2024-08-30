import * as vscode from 'vscode';
import wordAt from '../tools/wordAt';

interface DeclarationComment {
    text: string
    line: number
    col: number
}

function formatDeclarationComment(c: DeclarationComment): string {
    return `// ${c.text} - \n`;
}

export default function () {
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

        comments.push({
            text: wordAt(lineText, cursor.character),
            line: selection.start.line,
            col: 0
        });
    });

    // inserting comments
    editor.edit(b => {
        comments.forEach(c => {
            b.insert(new vscode.Position(c.line, c.col), formatDeclarationComment(c));
        });
    });
}
