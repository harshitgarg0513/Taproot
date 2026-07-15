import Parser from "tree-sitter";
import TypeScript from "tree-sitter-typescript";
const parser = new Parser();
parser.setLanguage(TypeScript.typescript);
export function parse(code) {
    return parser.parse(code);
}
