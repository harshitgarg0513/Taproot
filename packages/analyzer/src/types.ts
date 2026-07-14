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

export interface RepositoryAnalysis {
  files: ParsedFile[];
  symbols: SymbolNode[];
}
