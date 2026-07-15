import * as vscode from "vscode";

export function showEngineeringContextPanel() {
  const panel = vscode.window.createWebviewPanel(
    "eipContext",
    "Engineering Context",
    vscode.ViewColumn.One,
    { enableScripts: true },
  );

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
