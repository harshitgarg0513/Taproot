import * as vscode from "vscode";

import { render } from "./panel";
import { runQuery } from "./service";

export function registerCommands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("eip.context", async () => {
      const query = await vscode.window.showInputBox({
        prompt: "What do you want to implement?",
      });

      if (!query) {
        return;
      }

      const result = await runQuery(query);
      vscode.window.showInformationMessage("Engineering Context Ready");
      render(result);
    }),
  );
}
