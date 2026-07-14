import { describe, expect, it } from "vitest";
import ts from "typescript";
import { extractDecoratorComponents } from "../src/component/decoratorExtractor";

describe("decorator extractor branches", () => {
  it("maps controller, injectable, module, and entity decorators", () => {
    const source = ts.createSourceFile(
      "decorators.ts",
      `
        @Controller()
        class ControllerExample {}

        @Injectable()
        class ServiceExample {}

        @Module()
        class ModuleExample {}

        @Entity()
        class EntityExample {}
      `,
      ts.ScriptTarget.ES2022,
      true,
      ts.ScriptKind.TS,
    );

    const components = extractDecoratorComponents(source);

    expect(components.map((component) => component.type)).toEqual([
      "Controller",
      "Service",
      "Module",
      "Entity",
    ]);
  });
});
