declare module "tree-sitter-typescript" {
  interface TreeSitterLanguageModule {
    typescript: unknown;
    tsx: unknown;
  }

  const treeSitterTypescript: TreeSitterLanguageModule;
  export default treeSitterTypescript;
}
