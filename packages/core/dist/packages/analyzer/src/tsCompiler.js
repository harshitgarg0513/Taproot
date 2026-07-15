import ts from "typescript";
export function createProgram(rootNames) {
    return ts.createProgram({
        rootNames,
        options: {
            target: ts.ScriptTarget.ES2022,
            module: ts.ModuleKind.NodeNext,
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
            allowJs: false,
            skipLibCheck: true,
        },
    });
}
