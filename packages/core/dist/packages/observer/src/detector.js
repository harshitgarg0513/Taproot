import fs from "fs-extra";
import path from "path";
export async function detectProject(root, extensions) {
    const languages = [];
    if (extensions.has(".ts"))
        languages.push("TypeScript");
    if (extensions.has(".js"))
        languages.push("JavaScript");
    if (extensions.has(".py"))
        languages.push("Python");
    if (extensions.has(".go"))
        languages.push("Go");
    if (extensions.has(".java"))
        languages.push("Java");
    let framework = null;
    let packageManager = null;
    const packageJson = path.join(root, "package.json");
    if (await fs.pathExists(packageJson)) {
        const pkg = await fs.readJson(packageJson);
        const deps = {
            ...(pkg.dependencies ?? {}),
            ...(pkg.devDependencies ?? {}),
        };
        if (deps["@nestjs/core"])
            framework = "NestJS";
        else if (deps.next)
            framework = "Next.js";
        else if (deps.react)
            framework = "React";
        else if (deps.express)
            framework = "Express";
        if (pkg.packageManager?.startsWith("pnpm"))
            packageManager = "pnpm";
        else if (pkg.packageManager?.startsWith("yarn"))
            packageManager = "yarn";
        else
            packageManager = "npm";
    }
    return {
        languages,
        framework,
        packageManager,
    };
}
