declare module "tree-sitter-typescript" {
  interface TreeSitterLanguageModule {
    typescript: any;
    tsx: any;
  }

  const treeSitterTypescript: TreeSitterLanguageModule;
  export default treeSitterTypescript;
}
