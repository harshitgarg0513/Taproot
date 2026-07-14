import { z } from "zod";

export const ConfigSchema = z.object({
  ignore: z.array(z.string()),
  languages: z.array(z.string()),
  cache: z.boolean(),
  cacheTTL: z.number(),
  followSymlinks: z.boolean(),
  output: z.object({
    colors: z.boolean(),
    format: z.enum(["table", "json"]),
  }),
});
