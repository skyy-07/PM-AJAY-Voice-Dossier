import { QualificationPack } from '../../types.js';

export interface VectorSearchResult {
  qualificationPackId: string;
  score: number;
  matchedKeywords: string[];
}

export interface VectorSearchService {
  search(queryText: string, topK?: number): Promise<VectorSearchResult[]>;
  indexPacks(packs: QualificationPack[]): Promise<void>;
}

// In-memory fallback using cosine term-frequency embeddings
export class InMemoryVectorSearchService implements VectorSearchService {
  private indexedDocuments: Array<{
    id: string;
    tokens: Set<string>;
    rawText: string;
  }> = [];

  constructor() {}

  public async indexPacks(packs: QualificationPack[]): Promise<void> {
    this.indexedDocuments = packs.map(pack => {
      const combinedText = [
        pack.title,
        pack.sector,
        pack.description,
        ...pack.requiredSkills,
        ...pack.preferredSkills,
        ...pack.toolsRequired,
        ...pack.relatedTrades,
        ...pack.keywords
      ].join(' ').toLowerCase();

      const tokens = new Set(this.tokenize(combinedText));
      return {
        id: pack.id,
        tokens,
        rawText: combinedText
      };
    });
  }

  public async search(queryText: string, topK: number = 5): Promise<VectorSearchResult[]> {
    const queryTokens = this.tokenize(queryText.toLowerCase());
    if (queryTokens.length === 0) {
      return [];
    }

    const results: VectorSearchResult[] = [];

    for (const doc of this.indexedDocuments) {
      let matchCount = 0;
      const matchedKeywords: string[] = [];

      for (const token of queryTokens) {
        if (doc.tokens.has(token)) {
          matchCount++;
          matchedKeywords.push(token);
        } else {
          // Check substring match
          for (const docToken of doc.tokens) {
            if (docToken.includes(token) || token.includes(docToken)) {
              matchCount += 0.6;
              matchedKeywords.push(token);
              break;
            }
          }
        }
      }

      if (matchCount > 0) {
        const score = Math.min(1.0, matchCount / (Math.sqrt(queryTokens.length) * 2));
        results.push({
          qualificationPackId: doc.id,
          score,
          matchedKeywords: Array.from(new Set(matchedKeywords))
        });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, topK);
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2);
  }
}

export const vectorSearch = new InMemoryVectorSearchService();
