import { showEngineeringContextPanel } from "./panel";

export function registerCommands() {
  return [
    {
      command: "eip.context",
      callback: () => showEngineeringContextPanel(),
    },
  ];
}
