export function findComponent(model, name) {
    const normalized = name.toLowerCase();
    for (const component of model.components) {
        if (component.name.toLowerCase() === normalized) {
            return component;
        }
    }
    return undefined;
}
export function listComponents(model) {
    return [...model.components];
}
