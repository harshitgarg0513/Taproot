import * as vscode from "vscode";
import { registerCommands } from "./commands";

export function activate(context: vscode.ExtensionContext) {
  for (const command of registerCommands()) {
    context.subscriptions.push(vscode.commands.registerCommand(command.command, command.callback));
  }
}

export function deactivate() {}
