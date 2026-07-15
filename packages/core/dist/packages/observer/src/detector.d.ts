export interface DetectionResult {
    languages: string[];
    framework: string | null;
    packageManager: string | null;
}
export declare function detectProject(root: string, extensions: Set<string>): Promise<DetectionResult>;
