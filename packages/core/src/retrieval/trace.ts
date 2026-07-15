export interface RetrievalTrace {
  query: string;
  tokens: string[];
  matchedTokens: string[];
  seedCount: number;
  expandedCount: number;
}
