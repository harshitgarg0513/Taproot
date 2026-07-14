import type { EipConfig } from "@eip/config";
import type { Entity } from "@eip/analyzer";
import { BuildMetrics } from "./performance/index.js";

export interface RepositoryModel {
  config: EipConfig;
  metrics: BuildMetrics;
  knowledgeGraph: KnowledgeGraph;
  componentIndex: Map<
    string,
    {
      id: string;
      name: string;
      type: string;
      file: string;
      line: number;
    }
  >;
  symbolIndex: Map<
    string,
    {
      id: string;
      name: string;
      kind: string;
      file: string;
      line: number;
    }
  >;
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
  entities: Entity[];
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
