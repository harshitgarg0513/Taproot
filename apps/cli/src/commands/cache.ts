import { cacheSize, clearCache } from "@taproot/core";

export async function cache(action: string) {
  switch (action) {
    case "size":
      console.log("Cache Entries:", cacheSize());
      break;
    case "clear":
      clearCache();
      console.log("Cache cleared.");
      break;
    default:
      console.log("Unknown action.");
  }
}
