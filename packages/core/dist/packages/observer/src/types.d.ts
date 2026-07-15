export interface RepositorySnapshot {
    name: string;
    rootPath: string;
    totalFiles: number;
    totalDirectories: number;
    languages: string[];
    framework: string | null;
    packageManager: string | null;
    hasGit: boolean;
    scannedAt: Date;
    scanDurationMs: number;
}
export interface ScanResult {
    files: number;
    directories: number;
    extensions: Set<string>;
}
