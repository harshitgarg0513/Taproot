import pc from "picocolors";
import { analyzeRepository } from "@eip/analyzer";
import { observeRepository } from "@eip/observer";
import { formatDuration } from "@eip/shared";

export async function inspect(path: string) {
  let snapshotResult;
  let analysisResult;

  console.log("[inspect] observing repository");
  try {
    snapshotResult = await observeRepository(path);
  } catch (error) {
    console.error("Failed during repository observation:");
    console.error(error);
    process.exit(1);
  }
  console.log("[inspect] observation complete");

  if (!snapshotResult.success) {
    console.error(snapshotResult.error.message);
    process.exit(1);
  }

  console.log("[inspect] analyzing repository");
  try {
    analysisResult = await analyzeRepository(path);
  } catch (error) {
    console.error("Failed during repository analysis:");
    console.error(error);
    process.exit(1);
  }
  console.log("[inspect] analysis complete");

  if (!analysisResult.success) {
    console.error(analysisResult.error.message);
    process.exit(1);
  }

  try {
    console.log("[inspect] assigning snapshot and analysis");
    const snapshot = snapshotResult.data;
    console.log("[inspect] snapshot assigned");
    const analysis = analysisResult.data;
    console.log("[inspect] analysis assigned");

    console.log("[inspect] rendering report");
    console.log();
    console.log(pc.cyan("Engineering Intelligence Platform"));
    console.log("--------------------------------------");
    console.log("Repository       :", snapshot.name);
    console.log("Path             :", snapshot.rootPath);
    console.log("Languages        :", snapshot.languages.join(", "));
    console.log("Framework        :", snapshot.framework ?? "-");
    console.log("Package Manager  :", snapshot.packageManager ?? "-");
    console.log("Git              :", snapshot.hasGit ? "Yes" : "No");
    console.log("Files            :", snapshot.totalFiles);
    console.log("Directories      :", snapshot.totalDirectories);

    const classes = analysis.symbols.filter((s) => s.kind === "class").length;
    const functions = analysis.symbols.filter(
      (s) => s.kind === "function",
    ).length;
    const methods = analysis.symbols.filter((s) => s.kind === "method").length;
    const interfaces = analysis.symbols.filter(
      (s) => s.kind === "interface",
    ).length;
    const types = analysis.symbols.filter((s) => s.kind === "type").length;
    const enums = analysis.symbols.filter((s) => s.kind === "enum").length;
    const imports = analysis.symbols.filter((s) => s.kind === "import").length;
    const exportsCount = analysis.symbols.filter(
      (s) => s.kind === "export",
    ).length;

    console.log("TS Files         :", analysis.files.length);
    console.log("Symbols          :", analysis.symbols.length);
    console.log("Classes          :", classes);
    console.log("Interfaces       :", interfaces);
    console.log("Enums            :", enums);
    console.log("Types            :", types);
    console.log("Functions        :", functions);
    console.log("Methods          :", methods);
    console.log("Imports          :", imports);
    console.log("Exports          :", exportsCount);
    console.log("Relationships    :", analysis.relationships.length);
    console.log("Function Calls   :", analysis.callGraph.length);

    const controllerCount = analysis.components.filter(
      (component) => component.type === "Controller",
    ).length;
    const serviceCount = analysis.components.filter(
      (component) => component.type === "Service",
    ).length;
    const moduleCount = analysis.components.filter(
      (component) => component.type === "Module",
    ).length;
    const repositoryCount = analysis.components.filter(
      (component) => component.type === "Repository",
    ).length;
    const entityCount = analysis.components.filter(
      (component) => component.type === "Entity",
    ).length;

    console.log("Components       :", analysis.components.length);
    console.log("Controllers      :", controllerCount);
    console.log("Services         :", serviceCount);
    console.log("Modules          :", moduleCount);
    console.log("Repositories     :", repositoryCount);
    console.log("Entities         :", entityCount);
    console.log("Scan Time        :", formatDuration(snapshot.scanDurationMs));
    console.log();
  } catch (error) {
    console.error("[inspect] report rendering failed");
    console.error(error);
    if (error instanceof Error) {
      console.error(error.stack);
    }
    throw error;
  }
}
