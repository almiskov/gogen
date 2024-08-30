const declarationCharacter = new RegExp(`[a-zA-Z0-9_]`);

export default function(lineText: string, cursorPosition: number) : string {
    // go backward to find start of name
    let startCharacterIndex;

    let currentCharIndex = cursorPosition;
    let currentChar = lineText.charAt(currentCharIndex);

    while (declarationCharacter.test(currentChar)) {
        startCharacterIndex = currentCharIndex;
        currentCharIndex--;
        currentChar = lineText.charAt(currentCharIndex);
    }

    // go forward to find end of name
    let endCharacterIndex;

    currentCharIndex = cursorPosition;
    currentChar = lineText.charAt(currentCharIndex);

    while (declarationCharacter.test(currentChar)) {
        currentChar = lineText.charAt(currentCharIndex);
        endCharacterIndex = currentCharIndex;
        currentCharIndex++;
    }

    return lineText.slice(startCharacterIndex, endCharacterIndex);
}