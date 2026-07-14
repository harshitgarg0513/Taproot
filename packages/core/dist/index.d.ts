import { EipConfig } from '@eip/config';
import { Entity } from '@eip/analyzer';
import { Result } from '@eip/shared';

declare class Timer {
    private readonly start;
    end(): number;
}

interface BuildMetrics {
    observerMs: number;
    analyzerMs: number;
    graphMs: number;
    totalMs: number;
}

interface RepositoryModel {
    config: EipConfig;
    metrics: BuildMetrics;
    knowledgeGraph: KnowledgeGraph;
    componentIndex: Map<string, {
        id: string;
        name: string;
        type: string;
        file: string;
        line: number;
    }>;
    symbolIndex: Map<string, {
        id: string;
        name: string;
        kind: string;
        file: string;
        line: number;
    }>;
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

declare function buildRepositoryModel(repo: string): Promise<Result<RepositoryModel>>;

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

interface ImpactResult {
    changedFile: string;
    impactedFiles: string[];
    impactedComponents: string[];
    impactedSymbols: string[];
}
declare function analyzeImpact(model: RepositoryModel, changedFile: string): Result<ImpactResult>;

interface SearchResult {
    components: RepositoryModel["components"];
    symbols: RepositoryModel["symbols"];
    files: string[];
}
declare function searchRepository(model: RepositoryModel, query: string): Result<SearchResult>;

declare function buildKnowledge(repo: string): Promise<Result<KnowledgeGraph>>;

declare function buildKnowledgeGraph(model: RepositoryModel): KnowledgeGraph;

declare function getCachedModel(key: string): RepositoryModel | null;
declare function setCachedModel(key: string, model: RepositoryModel): void;
declare function clearCache(): void;
declare function cacheSize(): number;

declare function createCacheKey(repo: string): string;

interface ExplainResult {
    component: string;
    type: string;
    file: string;
    symbols: string[];
    imports: string[];
    dependencies: string[];
    callers: string[];
    callees: string[];
    summary: string;
}
declare function explainComponent(model: RepositoryModel, name: string): ExplainResult | null;

declare function formatExplain(result: ExplainResult): void;

declare function buildSummary(result: ExplainResult): string;

export { type BuildMetrics, type ExplainResult, type ImpactResult, type KnowledgeEdge, type KnowledgeGraph, type KnowledgeNode, type RepositoryModel, type SearchResult, Timer, analyzeImpact, buildKnowledge, buildKnowledgeGraph, buildRepositoryModel, buildSummary, cacheSize, clearCache, createCacheKey, dependenciesOf, dependentsOf, explainComponent, findComponent, findSymbol, formatExplain, getCachedModel, impactedFiles, listComponents, searchRepository, setCachedModel };
