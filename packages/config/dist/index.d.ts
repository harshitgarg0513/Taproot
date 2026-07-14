interface EipConfig {
    ignore: string[];
    languages: string[];
    cache: boolean;
    cacheTTL: number;
    followSymlinks: boolean;
    output: {
        colors: boolean;
        format: "table" | "json";
    };
}

declare function loadConfig(repo: string): Promise<EipConfig>;

declare const defaultConfig: EipConfig;

export { type EipConfig, defaultConfig, loadConfig };
