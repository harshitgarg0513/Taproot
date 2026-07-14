import { Result } from '@eip/shared';

type SymbolKind = "class" | "function" | "method" | "interface" | "type" | "enum" | "variable" | "import" | "export";
interface SymbolNode {
    id: string;
    kind: SymbolKind;
    name: string;
    file: string;
    line: number;
}
interface ParsedFile {
    path: string;
    symbols: SymbolNode[];
}
interface Relationship {
    from: string;
    to: string;
    type: "IMPORTS";
}
interface CallRelationship {
    caller: string;
    callee: string;
    file: string;
}
type ComponentType = "Controller" | "Service" | "Module" | "Repository" | "Entity" | "Unknown";
type EntityKind = "File" | "Class" | "Function" | "Method" | "Interface" | "Type" | "Enum" | "Variable";
interface Component {
    id: string;
    name: string;
    type: ComponentType;
    file: string;
    line: number;
}
interface Entity {
    id: string;
    kind: EntityKind;
    name: string;
    file: string;
    line: number;
}
interface ClassificationSignal {
    name: string;
    score: number;
}
interface ClassifiedEntity {
    entity: Entity;
    labels: {
        type: string;
        confidence: number;
        signals: ClassificationSignal[];
    }[];
}
interface RepositoryAnalysis {
    files: ParsedFile[];
    symbols: SymbolNode[];
    relationships: Relationship[];
    components: Component[];
    callGraph: CallRelationship[];
    entities: Entity[];
    classified: ClassifiedEntity[];
}

declare function analyzeRepository(root: string): Promise<Result<RepositoryAnalysis>>;

export { type CallRelationship, type ClassificationSignal, type ClassifiedEntity, type Component, type ComponentType, type Entity, type EntityKind, type ParsedFile, type Relationship, type RepositoryAnalysis, type SymbolKind, type SymbolNode, analyzeRepository };
