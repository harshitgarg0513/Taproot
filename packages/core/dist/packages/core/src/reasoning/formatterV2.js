export function printExplain(e) {
    console.log();
    console.log("================================");
    console.log(e.name);
    console.log("================================");
    console.log();
    console.log("Kind:", e.kind);
    console.log();
    console.log("Responsibility");
    console.log(e.responsibility);
    console.log();
    console.log("Classification");
    console.table(e.classification);
    console.log();
    console.log("Imports");
    console.table(e.dependency.imports);
    console.log();
    console.log("Imported By");
    console.table(e.dependency.importedBy);
    console.log();
    console.log("Calls");
    console.table(e.dependency.calls);
    console.log();
    console.log("Called By");
    console.table(e.dependency.calledBy);
}
