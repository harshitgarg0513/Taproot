interface ParsedFunction {
    name: string;
    line: number;
}
interface ParsedClass {
    name: string;
    line: number;
}
interface ParsedImport {
    module: string;
}
interface ParsedFile {
    path: string;
    functions: ParsedFunction[];
    classes: ParsedClass[];
    imports: ParsedImport[];
}
interface RepositoryAnalysis {
    files: ParsedFile[];
}

declare function analyzeRepository(root: string): Promise<RepositoryAnalysis>;

export { type ParsedClass, type ParsedFile, type ParsedFunction, type ParsedImport, type RepositoryAnalysis, analyzeRepository };
