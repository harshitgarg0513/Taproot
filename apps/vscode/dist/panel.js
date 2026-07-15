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
exports.showEngineeringContextPanel = showEngineeringContextPanel;
const vscode = __importStar(require("vscode"));
function showEngineeringContextPanel() {
    const panel = vscode.window.createWebviewPanel("eipContext", "Engineering Context", vscode.ViewColumn.One, { enableScripts: true });
    panel.webview.html = `
    <html>
      <body style="font-family: sans-serif; padding: 16px;">
        <h2>Engineering Context</h2>
        <hr />
        <p><strong>Intent</strong></p>
        <p>implement refresh tokens</p>
        <p><strong>Selected Files</strong></p>
        <ul>
          <li>AuthService</li>
          <li>TokenRepository</li>
          <li>JwtService</li>
        </ul>
        <p><strong>Reasons</strong></p>
        <ul>
          <li>graph-degree:2</li>
          <li>matched repository vocabulary</li>
        </ul>
        <p><strong>Confidence</strong></p>
        <p>Medium</p>
        <p><strong>Prompt</strong></p>
        <pre>Engineering Task\nimplement refresh tokens</pre>
        <button>Send</button>
      </body>
    </html>
  `;
}
