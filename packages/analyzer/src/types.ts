export type SymbolKind =
  | "class"
  | "function"
  | "method"
  | "interface"
  | "type"
  | "enum"
  | "variable"
  | "import"
  | "export";

export interface SymbolNode {
  id: string;
  kind: SymbolKind;
  name: string;
  file: string;
  line: number;
}

export interface ParsedFile {
  path: string;
  symbols: SymbolNode[];
}

export interface Relationship {
  from: string;
  to: string;
  type: "IMPORTS";
}

export interface RepositoryAnalysis {
  files: ParsedFile[];
  symbols: SymbolNode[];
  relationships: Relationship[];
}
