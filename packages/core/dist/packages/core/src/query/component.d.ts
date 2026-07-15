import { RepositoryModel } from "../types.js";
export declare function findComponent(model: RepositoryModel, name: string): {
    id: string;
    name: string;
    type: string;
    file: string;
    line: number;
} | undefined;
export declare function listComponents(model: RepositoryModel): {
    id: string;
    name: string;
    type: string;
    file: string;
    line: number;
}[];
