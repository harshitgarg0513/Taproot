export interface EipConfig {
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
