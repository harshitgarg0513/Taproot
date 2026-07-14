export interface ParsedFunction {
  name: string;
  line: number;
}

export interface ParsedClass {
  name: string;
  line: number;
}

export interface ParsedImport {
  module: string;
}

export interface ParsedFile {
  path: string;
  functions: ParsedFunction[];
  classes: ParsedClass[];
  imports: ParsedImport[];
}

export interface RepositoryAnalysis {
  files: ParsedFile[];
}
