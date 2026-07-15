export function inferResponsibility(entity) {
    const label = entity.labels[0]?.type;
    switch (label) {
        case "service":
            return "Business logic layer.";
        case "controller":
            return "Entry point for requests.";
        case "repository":
            return "Database access.";
        case "module":
            return "Dependency wiring.";
        default:
            return "General code unit.";
    }
}
