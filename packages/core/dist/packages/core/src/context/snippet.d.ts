export interface CodeSnippet {
    file: string;
    content: string;
    lines: number;
}
export declare function loadSnippet(file: string, maxLines?: number): Promise<CodeSnippet>;
