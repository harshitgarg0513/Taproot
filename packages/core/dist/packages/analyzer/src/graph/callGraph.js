export function buildCallGraph(tree, file) {
    const calls = [];
    let currentFunction = "GLOBAL";
    function visit(node) {
        if (node.type === "function_declaration" ||
            node.type === "method_definition") {
            const name = node.childForFieldName("name")?.text;
            if (name) {
                currentFunction = name;
            }
        }
        if (node.type === "call_expression") {
            const fn = node.childForFieldName("function");
            if (fn) {
                calls.push({
                    caller: currentFunction,
                    callee: fn.text,
                    file,
                });
            }
        }
        for (const child of node.children) {
            visit(child);
        }
    }
    visit(tree.rootNode);
    return calls;
}
