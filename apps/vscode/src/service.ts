import { buildRepositoryModel, generate } from "@taproot/core";

import * as vscode from "vscode";

export async function runQuery(query: string) {
  const workspace = vscode.workspace.workspaceFolders?.[0];

  if (!workspace) {
    throw new Error("No workspace opened");
  }

  const model = await buildRepositoryModel(workspace.uri.fsPath);

  if (!model.success) {
    throw model.error;
  }

  return generate(model.data, query);
}
