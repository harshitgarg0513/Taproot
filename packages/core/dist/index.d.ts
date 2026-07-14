interface RepositoryModel {
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
interface KnowledgeNode {
    id: string;
    type: "Component" | "File" | "Symbol";
    label: string;
}
interface KnowledgeEdge {
    from: string;
    to: string;
    relation: "contains" | "imports" | "calls";
}
interface KnowledgeGraph {
    nodes: KnowledgeNode[];
    edges: KnowledgeEdge[];
}

declare function buildRepositoryModel(repo: string): Promise<RepositoryModel>;

declare function findComponent(model: RepositoryModel, name: string): {
    id: string;
    name: string;
    type: string;
    file: string;
    line: number;
} | undefined;
declare function listComponents(model: RepositoryModel): {
    id: string;
    name: string;
    type: string;
    file: string;
    line: number;
}[];

declare function findSymbol(model: RepositoryModel, name: string): {
    id: string;
    name: string;
    kind: string;
    file: string;
    line: number;
}[];

declare function dependenciesOf(model: RepositoryModel, file: string): {
    from: string;
    to: string;
    type: string;
}[];
declare function dependentsOf(model: RepositoryModel, file: string): {
    from: string;
    to: string;
    type: string;
}[];

declare function impactedFiles(model: RepositoryModel, file: string): string[];

declare function buildKnowledge(repo: string): Promise<KnowledgeGraph>;

declare function buildKnowledgeGraph(model: RepositoryModel): KnowledgeGraph;

export { type KnowledgeEdge, type KnowledgeGraph, type KnowledgeNode, type RepositoryModel, buildKnowledge, buildKnowledgeGraph, buildRepositoryModel, dependenciesOf, dependentsOf, findComponent, findSymbol, impactedFiles, listComponents };
