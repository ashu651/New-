# Advanced OpenSearch templates

- Synonyms: maintain `synonyms.txt` with domain-specific expansions (e.g., reel ~ short video)
- Analyzers: use edge n-grams for typeahead, standard for search; keep lowercase + asciifolding
- Hybrid Search: run both vector search (via pgvector) and keyword search in API, blend by recency and quality