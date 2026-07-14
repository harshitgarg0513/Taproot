interface RepositorySnapshot {
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
interface ScanResult {
    files: number;
    directories: number;
    extensions: Set<string>;
}

declare function observeRepository(root: string): Promise<RepositorySnapshot>;

export { type RepositorySnapshot, type ScanResult, observeRepository };
