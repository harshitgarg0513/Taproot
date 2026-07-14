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
interface Relationship {
    from: string;
    to: string;
    type: "IMPORTS";
}
type ComponentType = "Controller" | "Service" | "Module" | "Repository" | "Entity" | "Unknown";
interface Component {
    id: string;
    name: string;
    type: ComponentType;
    file: string;
    line: number;
}
interface RepositoryAnalysis {
    files: ParsedFile[];
    symbols: SymbolNode[];
    relationships: Relationship[];
    components: Component[];
}

declare function analyzeRepository(root: string): Promise<RepositoryAnalysis>;

export { type Component, type ComponentType, type ParsedFile, type Relationship, type RepositoryAnalysis, type SymbolKind, type SymbolNode, analyzeRepository };
