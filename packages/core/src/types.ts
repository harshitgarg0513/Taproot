import type { TaprootConfig } from "@taproot/config";
import type { ClassifiedEntity, Entity } from "@taproot/analyzer";
import { BuildMetrics } from "./performance/index.js";

export type { ClassifiedEntity, Entity } from "@taproot/analyzer";

export interface CachedRepositoryModel {
  config: TaprootConfig;
  metrics: BuildMetrics;
  knowledgeGraph: KnowledgeGraph;
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
  classified: ClassifiedEntity[];
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

export interface RepositoryModel extends CachedRepositoryModel {
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
