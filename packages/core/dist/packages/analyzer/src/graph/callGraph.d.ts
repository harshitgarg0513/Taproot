import Parser from "tree-sitter";
import { CallRelationship } from "../types.js";
export declare function buildCallGraph(tree: Parser.Tree, file: string): CallRelationship[];
