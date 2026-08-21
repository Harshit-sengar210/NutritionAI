import { nutritionKnowledge, KnowledgeDocument } from '@/data/nutritionKnowledge';

export interface RetrievalResult {
  document: KnowledgeDocument;
  score: number;
}

/**
 * A mock RAG retrieval system.
 * In a real application, this would convert the query to an embedding vector
 * and perform a cosine similarity search in a vector database (e.g. Pinecone, pgvector).
 * Here, we use a simple keyword scoring heuristic for the demo.
 */
export const retrieveKnowledge = async (query: string, limit: number = 2): Promise<RetrievalResult[]> => {
  return new Promise((resolve) => {
    // Simulate network/database latency
    setTimeout(() => {
      const normalizedQuery = query.toLowerCase();
      const keywords = normalizedQuery.split(' ').filter(w => w.length > 2);
      
      const scoredDocs = nutritionKnowledge.map(doc => {
        let score = 0;
        
        // Exact title match gets highest score
        if (doc.title.toLowerCase().includes(normalizedQuery)) score += 10;
        
        // Tag matches
        doc.tags.forEach(tag => {
          if (normalizedQuery.includes(tag.toLowerCase())) score += 5;
        });

        // Content matches
        keywords.forEach(keyword => {
          if (doc.content.toLowerCase().includes(keyword)) score += 1;
          if (doc.tags.includes(keyword)) score += 2;
        });

        return { document: doc, score };
      });

      // Sort by score descending, filter out zero scores, and take top N
      const results = scoredDocs
        .filter(d => d.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      resolve(results);
    }, 500); // 500ms latency
  });
};
