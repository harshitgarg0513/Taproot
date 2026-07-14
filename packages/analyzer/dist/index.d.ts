type SymbolKind = "class" | "function" | "method" | "interface" | "type" | "enum" | "variable" | "import" | "export";
interface SymbolNode {
    id: string;
    kind: SymbolKind;
    name: string;
    file: string;
    line: number;
}
interface ParsedFile {
    path: string;
    symbols: SymbolNode[];
}
interface RepositoryAnalysis {
    files: ParsedFile[];
    symbols: SymbolNode[];
}

declare function analyzeRepository(root: string): Promise<RepositoryAnalysis>;

export { type ParsedFile, type RepositoryAnalysis, type SymbolKind, type SymbolNode, analyzeRepository };
