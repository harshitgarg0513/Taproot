import { EipConfig } from '@eip/config';
import * as _eip_analyzer from '@eip/analyzer';
import { Entity, ClassifiedEntity } from '@eip/analyzer';
export { ClassifiedEntity, Entity } from '@eip/analyzer';
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

interface DependencySummary {
    imports: string[];
    importedBy: string[];
    calls: string[];
    calledBy: string[];
}
declare function buildDependencySummary(model: RepositoryModel, file: string): DependencySummary;

interface ExplainComponentResult {
    component: string;
    file: string;
    kind: string;
    source: "component" | "symbol";
}
declare function explainComponent(model: RepositoryModel, query: string): ExplainComponentResult | null;
declare function explain(model: RepositoryModel, entityName: string): {
    name: string;
    kind: _eip_analyzer.EntityKind;
    classification: {
        type: string;
        confidence: number;
        signals: _eip_analyzer.ClassificationSignal[];
    }[];
    responsibility: string;
    dependency: DependencySummary;
} | null;

declare function inferResponsibility(entity: ClassifiedEntity): "Business logic layer." | "Entry point for requests." | "Database access." | "Dependency wiring." | "General code unit.";

declare function printExplain(e: {
    name: string;
    kind: string;
    responsibility: string;
    classification: ClassifiedEntity["labels"];
    dependency: {
        imports: string[];
        importedBy: string[];
        calls: string[];
        calledBy: string[];
    };
}): void;

interface RiskResult {
    target: string;
    score: number;
    level: "LOW" | "MEDIUM" | "HIGH";
    impactedFiles: string[];
    impactedSymbols: string[];
    impactedComponents: string[];
}
declare function analyzeRisk(model: RepositoryModel, target: string): RiskResult;

declare function printRisk(result: RiskResult): void;

interface RetrievalResult {
    id: string;
    score: number;
    reasons: string[];
}

declare function retrieve(model: RepositoryModel, query: string): {
    query: string;
    tokens: string[];
    ranked: RetrievalResult[];
    expanded: Set<string>;
};

interface RetrievalTrace {
    query: string;
    tokens: string[];
    matchedTokens: string[];
    seedCount: number;
    expandedCount: number;
}

interface RankedContext {
    id: string;
    score: number;
    reasons: string[];
}

declare function buildContext(model: RepositoryModel, query: string): {
    retrieval: {
        query: string;
        tokens: string[];
        ranked: RetrievalResult[];
        expanded: Set<string>;
    };
    budget: RankedContext[];
    prompt: string;
};

interface AIProvider {
    complete(prompt: string): Promise<string>;
}

interface Metrics {
    precision: number;
    recall: number;
    f1: number;
}

declare function evaluateCommit(model: RepositoryModel, message: string, actualFiles: string[]): Metrics;

declare function printReport(results: Metrics[]): void;

export { type AIProvider, type BuildMetrics, type DependencySummary, type ExplainComponentResult, type ImpactResult, type KnowledgeEdge, type KnowledgeGraph, type KnowledgeNode, type RepositoryModel, type RetrievalTrace, type RiskResult, type SearchResult, Timer, analyzeImpact, analyzeRisk, buildContext, buildDependencySummary, buildKnowledge, buildKnowledgeGraph, buildRepositoryModel, cacheSize, clearCache, createCacheKey, dependenciesOf, dependentsOf, evaluateCommit, explain, explainComponent, findComponent, findSymbol, getCachedModel, impactedFiles, inferResponsibility, listComponents, printExplain, printReport, printRisk, retrieve, searchRepository, setCachedModel };
