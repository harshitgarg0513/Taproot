"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommands = registerCommands;
const panel_1 = require("./panel");
function registerCommands() {
    return [
        {
            command: "eip.context",
            callback: () => (0, panel_1.showEngineeringContextPanel)(),
        },
    ];
}
