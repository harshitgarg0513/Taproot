"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = render;
const vscode = __importStar(require("vscode"));
function render(result) {
    const panel = vscode.window.createWebviewPanel("eip", "Engineering Context", vscode.ViewColumn.Two, {
        enableScripts: true,
    });
    const confidenceLevel = result.context.success ? result.context.retrieval.confidence.level : result.context.confidence.level;
    const selectedFiles = result.context.success
        ? result.context.budget.map((x) => `<li>${x.path}</li>`).join("")
        : "";
    const message = result.context.success ? "" : `<p>${result.context.message}</p>`;
    panel.webview.html = `
<html>
<body>
<h2>Engineering Context</h2>
<h3>Confidence</h3>
<p>${confidenceLevel}</p>
<h3>Selected Files</h3>
<ul>${selectedFiles}</ul>
${message}
<h3>Gemini</h3>
<pre>${result.answer}</pre>
</body>
</html>
`;
}
