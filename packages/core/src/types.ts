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
  callGraph: Array<{
    caller: string;
    callee: string;
    file: string;
  }>;
}

export interface KnowledgeNode {
  id: string;
  type: "Component" | "File" | "Symbol";
  label: string;
}

export interface KnowledgeEdge {
  from: string;
  to: string;
  relation: "contains" | "imports" | "calls";
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}
