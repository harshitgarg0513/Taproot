export function extractEntities(tree, file) {
    const entities = [];
    function push(kind, name, line) {
        entities.push({
            id: `${file}:${line}:${kind}:${name}`,
            kind,
            name,
            file,
            line,
        });
    }
    function visit(node) {
        switch (node.type) {
            case "class_declaration":
                push("Class", node.childForFieldName("name")?.text ?? "Anonymous", node.startPosition.row + 1);
                break;
            case "function_declaration":
                push("Function", node.childForFieldName("name")?.text ?? "anonymous", node.startPosition.row + 1);
                break;
            case "method_definition":
                push("Method", node.childForFieldName("name")?.text ?? "anonymous", node.startPosition.row + 1);
                break;
            case "interface_declaration":
                push("Interface", node.childForFieldName("name")?.text ?? "anonymous", node.startPosition.row + 1);
                break;
            case "enum_declaration":
                push("Enum", node.childForFieldName("name")?.text ?? "anonymous", node.startPosition.row + 1);
                break;
            case "type_alias_declaration":
                push("Type", node.childForFieldName("name")?.text ?? "anonymous", node.startPosition.row + 1);
                break;
        }
        for (const child of node.children) {
            visit(child);
        }
    }
    visit(tree.rootNode);
    return entities;
}
