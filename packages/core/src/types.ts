export interface RepositoryModel {
  components: Array<{
    id: string;
    name: string;
    type: string;
    file: string;
    line: number;
  }>;
  symbols: Array<{
    id: string;
    name: string;
    kind: string;
    file: string;
    line: number;
  }>;
  relationships: Array<{
    from: string;
    to: string;
    type: string;
  }>;
}
