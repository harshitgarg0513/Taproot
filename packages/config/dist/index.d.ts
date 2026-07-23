interface TaprootConfig {
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

declare function loadConfig(repo: string): Promise<TaprootConfig>;

declare const defaultConfig: TaprootConfig;

export { type TaprootConfig, defaultConfig, loadConfig };
