import { buildKnowledge } from "@eip/core";

export async function knowledge(repo: string) {
  const graph = await buildKnowledge(repo);

  console.log();
  console.log("Knowledge Graph");
  console.log("----------------");
  console.log("Nodes :", graph.nodes.length);
  console.log("Edges :", graph.edges.length);
}
