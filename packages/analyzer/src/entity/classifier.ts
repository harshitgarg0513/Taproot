import { Entity } from "../types";

export interface Classification {
  entityId: string;
  label: string;
  confidence: number;
}

export function classify(entity: Entity): Classification[] {
  const result: Classification[] = [];
  const n = entity.name;

  if (n.endsWith("Controller"))
    result.push({ entityId: entity.id, label: "Controller", confidence: 0.99 });

  if (n.endsWith("Service"))
    result.push({ entityId: entity.id, label: "Service", confidence: 0.99 });

  if (n.endsWith("Module"))
    result.push({ entityId: entity.id, label: "Module", confidence: 0.99 });

  if (n.endsWith("Repository"))
    result.push({ entityId: entity.id, label: "Repository", confidence: 0.99 });

  if (n.endsWith("Entity"))
    result.push({ entityId: entity.id, label: "Entity", confidence: 0.99 });

  return result;
}
