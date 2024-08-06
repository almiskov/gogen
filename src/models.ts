export interface DeclarationComment {
    text: string
    line: number
    col: number
}

export function formatDeclarationComment(c: DeclarationComment) : string {
    return `// ${c.text} -\n`;
}
