-- Vector indexes for similarity search
CREATE INDEX IF NOT EXISTS user_embeddings_vec_idx ON user_embeddings USING ivfflat (vec vector_l2_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS content_embeddings_vec_idx ON content_embeddings USING ivfflat (vec vector_l2_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS sound_embeddings_vec_idx ON sound_embeddings USING ivfflat (vec vector_l2_ops) WITH (lists = 100);

-- Trigram for handles and captions
CREATE INDEX IF NOT EXISTS users_handle_trgm_idx ON users USING gin (handle gin_trgm_ops);
CREATE INDEX IF NOT EXISTS posts_caption_trgm_idx ON posts USING gin (caption gin_trgm_ops);