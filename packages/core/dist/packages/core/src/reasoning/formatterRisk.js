export function printRisk(result) {
    console.log();
    console.log("================================");
    console.log("Risk Analysis");
    console.log("================================");
    console.log();
    console.log("Target:", result.target);
    console.log("Risk:", result.level, `(${result.score}/100)`);
    console.log();
    console.log("Impacted Components");
    console.table(result.impactedComponents);
    console.log();
    console.log("Impacted Files");
    console.table(result.impactedFiles);
    console.log();
    console.log("Impacted Symbols");
    console.table(result.impactedSymbols);
}
