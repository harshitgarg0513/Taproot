import { buildKnowledge } from "@eip/core";

export async function knowledge(repo: string) {
  const graphResult = await buildKnowledge(repo);

  if (!graphResult.success) {
    console.error(graphResult.error.message);
    process.exit(1);
  }

  const graph = graphResult.data;

  console.log();
  console.log("Knowledge Graph");
  console.log("----------------");
  console.log("Nodes :", graph.nodes.length);
  console.log("Edges :", graph.edges.length);
}
