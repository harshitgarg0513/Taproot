import { RepositoryModel } from "../types.js";
export declare function dependenciesOf(model: RepositoryModel, file: string): {
    from: string;
    to: string;
    type: string;
}[];
export declare function dependentsOf(model: RepositoryModel, file: string): {
    from: string;
    to: string;
    type: string;
}[];
