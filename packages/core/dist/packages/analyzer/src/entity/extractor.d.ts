import Parser from "tree-sitter";
import { Entity } from "../types";
export declare function extractEntities(tree: Parser.Tree, file: string): Entity[];
