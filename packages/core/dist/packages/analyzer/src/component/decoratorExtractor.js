import ts from "typescript";
function hasDecorator(node, name) {
    const decorators = ts.getDecorators(node);
    if (!decorators)
        return false;
    return decorators.some((decorator) => {
        const expression = decorator.expression;
        const target = ts.isCallExpression(expression)
            ? expression.expression
            : expression;
        return target.getText() === name || target.getText().endsWith(`.${name}`);
    });
}
export function extractDecoratorComponents(source) {
    const components = [];
    function visit(node) {
        if (ts.isClassDeclaration(node) && node.name) {
            let type = "Unknown";
            if (hasDecorator(node, "Controller"))
                type = "Controller";
            else if (hasDecorator(node, "Injectable"))
                type = "Service";
            else if (hasDecorator(node, "Module"))
                type = "Module";
            else if (hasDecorator(node, "Entity"))
                type = "Entity";
            components.push({
                id: `${source.fileName}:${node.name.text}`,
                name: node.name.text,
                type,
                file: source.fileName,
                line: source.getLineAndCharacterOfPosition(node.pos).line + 1,
            });
        }
        ts.forEachChild(node, visit);
    }
    visit(source);
    return components;
}
