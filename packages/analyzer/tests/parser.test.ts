import { describe, expect, it } from "vitest";
import { parse } from "../src/parser/parser";

describe("parser", () => {
  it("parses source", () => {
    const tree = parse("function hello(){}");

    expect(tree.rootNode).toBeTruthy();
  });
});
