export interface ContextProvider {
  getContext(): Promise<string>;
}

export class PlaceholderContextProvider implements ContextProvider {
  async getContext(): Promise<string> {
    return "Engineering Context";
  }
}
