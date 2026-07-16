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

interface CachedRepositoryModel {
    config: EipConfig;
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
interface RepositoryModel extends CachedRepositoryModel {
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

declare function hydrateRepositoryModel(model: CachedRepositoryModel): RepositoryModel;
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

type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW";
interface ConfidenceResult {
    level: ConfidenceLevel;
    score: number;
    reason: string;
    suggestions: string[];
}

interface RetrievalResult {
    id: string;
    path: string;
    score: number;
    reasons: string[];
    ids: string[];
}
declare function retrieve(model: RepositoryModel, query: string): {
    query: string;
    tokens: string[];
    ranked: RetrievalResult[];
    expanded: Set<string>;
    confidence: ConfidenceResult;
};

interface RetrievalTrace {
    query: string;
    tokens: string[];
    matchedTokens: string[];
    seedCount: number;
    expandedCount: number;
}

interface GenerationResult {
    provider: string;
    model: string;
    promptTokens?: number;
    completionTokens?: number;
    text: string;
}
declare function complete(prompt: string): Promise<GenerationResult>;

type ContextBuildResult = {
    success: true;
    retrieval: ReturnType<typeof retrieve>;
    confidence: ReturnType<typeof retrieve>["confidence"];
    budget: Array<{
        id: string;
        path: string;
        score: number;
        reasons: string[];
        ids: string[];
    }>;
    prompt: string;
    promptTokens: number;
} | {
    success: false;
    confidence: ReturnType<typeof retrieve>["confidence"];
    message: string;
};
declare function generate(model: RepositoryModel, query: string, repo?: string): Promise<{
    context: {
        success: false;
        confidence: ReturnType<typeof retrieve>["confidence"];
        message: string;
    };
    answer: string;
    generation: undefined;
    error?: never;
} | {
    context: {
        success: true;
        retrieval: ReturnType<typeof retrieve>;
        confidence: ReturnType<typeof retrieve>["confidence"];
        budget: Array<{
            id: string;
            path: string;
            score: number;
            reasons: string[];
            ids: string[];
        }>;
        prompt: string;
        promptTokens: number;
    };
    answer: string;
    generation: GenerationResult;
    error?: never;
} | {
    context: {
        success: true;
        retrieval: ReturnType<typeof retrieve>;
        confidence: ReturnType<typeof retrieve>["confidence"];
        budget: Array<{
            id: string;
            path: string;
            score: number;
            reasons: string[];
            ids: string[];
        }>;
        prompt: string;
        promptTokens: number;
    };
    answer: string;
    generation: undefined;
    error: Error;
}>;
declare function buildContext(model: RepositoryModel, query: string, repo?: string): Promise<ContextBuildResult>;

interface Metrics {
    precision: number;
    recall: number;
    f1: number;
}

declare function evaluateCommit(model: RepositoryModel, message: string, actualFiles: string[], repoRoot?: string): Metrics;

declare function printReport(results: Metrics[]): void;

interface Commit {
    hash: string;
    message: string;
}
declare function getCommitHistory(repo: string, limit?: number): Commit[];

declare function getChangedFiles(repo: string, hash: string): string[];

declare function shouldEvaluate(message: string, files: string[]): boolean;

export { type BuildMetrics, type CachedRepositoryModel, type Commit, type DependencySummary, type ExplainComponentResult, type GenerationResult, type ImpactResult, type KnowledgeEdge, type KnowledgeGraph, type KnowledgeNode, type RepositoryModel, type RetrievalResult, type RetrievalTrace, type RiskResult, type SearchResult, Timer, analyzeImpact, analyzeRisk, buildContext, buildDependencySummary, buildKnowledge, buildKnowledgeGraph, buildRepositoryModel, cacheSize, clearCache, complete, createCacheKey, dependenciesOf, dependentsOf, evaluateCommit, explain, explainComponent, findComponent, findSymbol, generate, getCachedModel, getChangedFiles, getCommitHistory, hydrateRepositoryModel, impactedFiles, inferResponsibility, listComponents, printExplain, printReport, printRisk, retrieve, searchRepository, setCachedModel, shouldEvaluate };
