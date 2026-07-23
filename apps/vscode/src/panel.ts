import * as vscode from "vscode";

type EngineeringContextResult =
  | {
      context: {
        success: true;
        retrieval: {
          confidence: {
            level: string;
          };
        };
        budget: Array<{
          path: string;
        }>;
      };
      answer: string;
    }
  | {
      context: {
        success: false;
        confidence: {
          level: string;
        };
        message: string;
      };
      answer: string;
    };

export function render(result: EngineeringContextResult) {
  const panel = vscode.window.createWebviewPanel(
    "taproot",
    "Engineering Context",
    vscode.ViewColumn.Two,
    {
      enableScripts: true,
    },
  );

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
