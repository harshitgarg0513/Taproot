import pc from "picocolors";
import { observeRepository } from "@eip/observer";
import { formatDuration } from "@eip/shared";

export async function inspect(path: string) {
  const snapshot = await observeRepository(path);

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
  console.log("Scan Time        :", formatDuration(snapshot.scanDurationMs));
  console.log();
}
