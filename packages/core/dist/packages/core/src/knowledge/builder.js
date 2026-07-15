import { buildRepositoryModel } from "../builder.js";
import { err, ok } from "@eip/shared";
export async function buildKnowledge(repo) {
    const modelResult = await buildRepositoryModel(repo);
    if (!modelResult.success) {
        return err(modelResult.error);
    }
    return ok(modelResult.data.knowledgeGraph);
}
