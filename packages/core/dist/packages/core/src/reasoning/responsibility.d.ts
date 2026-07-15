import type { ClassifiedEntity } from "../types.js";
export declare function inferResponsibility(entity: ClassifiedEntity): "Business logic layer." | "Entry point for requests." | "Database access." | "Dependency wiring." | "General code unit.";
