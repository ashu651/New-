import { Controller, Get, Query } from '@nestjs/common';
import { Client as OSClient } from '@opensearch-project/opensearch';
import fetch from 'cross-fetch';

@Controller('search')
export class SearchController {
  private os = new OSClient({ node: `http://${process.env.OPENSEARCH_HOST || 'localhost'}:${process.env.OPENSEARCH_PORT || 9200}` });

  @Get('posts')
  async searchPosts(@Query('q') q: string) {
    const lexical = await this.os.search({ index: 'posts_idx', body: { query: { multi_match: { query: q, fields: ['caption^2', 'hashtags', 'labels'] } }, size: 20 } });
    const aiBase = process.env.AI_BASE_URL || 'http://localhost:5000';
    const res = await fetch(`${aiBase}/embeddings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: q }) });
    const { vector } = (await res.json()) as { vector: number[] };
    // Placeholder: in a real system, use pgvector with ANN search. Here we return lexical and vector for client blending.
    return { lexical: (lexical.body as any).hits.hits, vector };
  }
}