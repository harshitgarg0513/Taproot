import type { ClassifiedEntity } from "../types.js";
export declare function printExplain(e: {
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
