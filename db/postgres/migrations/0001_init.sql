-- Enable extensions
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- Vector extension (pgvector)
CREATE EXTENSION IF NOT EXISTS vector;

-- Utility: updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Core tables from spec
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  handle CITEXT UNIQUE NOT NULL CHECK (length(handle) BETWEEN 3 AND 30),
  name TEXT, email CITEXT UNIQUE, phone TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  avatar_url TEXT, is_verified BOOLEAN DEFAULT FALSE,
  account_type TEXT CHECK (account_type IN ('personal','creator','business')) DEFAULT 'personal',
  country_code TEXT, language TEXT,
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT, website TEXT, dob DATE, gender TEXT, pronouns TEXT,
  privacy TEXT CHECK (privacy IN ('public','followers','private')) DEFAULT 'public',
  guardian_id BIGINT REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  device_id UUID, ip INET, ua TEXT,
  created_at TIMESTAMPTZ DEFAULT now(), expires_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions (user_id);

CREATE TABLE IF NOT EXISTS follows (
  follower_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  followee_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  quality_score NUMERIC(5,4) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (follower_id, followee_id)
);

CREATE TABLE IF NOT EXISTS blocks (
  blocker_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  blocked_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (blocker_id, blocked_id)
);

-- Auxiliary referenced tables
CREATE TABLE IF NOT EXISTS locations (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  lat DOUBLE PRECISION, lon DOUBLE PRECISION,
  country_code TEXT, admin1 TEXT, admin2 TEXT
);

CREATE TABLE IF NOT EXISTS collab_groups (
  id BIGSERIAL PRIMARY KEY,
  name TEXT, revenue_split JSONB, created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  author_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  kind TEXT CHECK (kind IN ('image','video','carousel')) NOT NULL,
  caption TEXT, location_id BIGINT REFERENCES locations(id),
  visibility TEXT CHECK (visibility IN ('public','followers','private')) DEFAULT 'public',
  is_collab BOOLEAN DEFAULT FALSE,
  collab_group_id BIGINT REFERENCES collab_groups(id),
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS posts_author_created_idx ON posts (author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS posts_created_idx ON posts (created_at);
CREATE TRIGGER posts_set_updated_at BEFORE UPDATE ON posts
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TABLE IF NOT EXISTS post_media (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  seq SMALLINT NOT NULL,
  media_url TEXT NOT NULL,
  mime TEXT, width INT, height INT, duration_ms INT,
  ai_labels JSONB,
  UNIQUE (post_id, seq)
);

CREATE TABLE IF NOT EXISTS hashtags (
  id BIGSERIAL PRIMARY KEY,
  tag CITEXT UNIQUE NOT NULL,
  use_count BIGINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS post_hashtags (
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  hashtag_id BIGINT REFERENCES hashtags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, hashtag_id)
);

CREATE TABLE IF NOT EXISTS sounds (
  id BIGSERIAL PRIMARY KEY,
  title TEXT, artist TEXT, url TEXT
);

CREATE TABLE IF NOT EXISTS reels (
  id BIGSERIAL PRIMARY KEY,
  author_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  sound_id BIGINT REFERENCES sounds(id), chapters JSONB, transcript TEXT,
  remix_of BIGINT, created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stories (
  id BIGSERIAL PRIMARY KEY,
  author_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL, caption TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reactions (
  content_kind TEXT CHECK (content_kind IN ('post','reel','comment')) NOT NULL,
  content_id BIGINT NOT NULL,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  emoji TEXT DEFAULT 'like',
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (content_kind, content_id, user_id)
);

CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  author_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  parent_id BIGINT REFERENCES comments(id),
  text TEXT NOT NULL,
  safety_flags JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS comments_post_created_idx ON comments (post_id, created_at);

CREATE TABLE IF NOT EXISTS saves (
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  content_kind TEXT CHECK (content_kind IN ('post','reel')) NOT NULL,
  content_id BIGINT NOT NULL,
  collection_id BIGINT,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, content_kind, content_id)
);

CREATE TABLE IF NOT EXISTS collections (
  id BIGSERIAL PRIMARY KEY,
  owner_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_smart BOOLEAN DEFAULT FALSE,
  rules JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS post_collaborators (
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('author','editor','sponsor')) DEFAULT 'author',
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS dm_threads (
  id BIGSERIAL PRIMARY KEY,
  is_group BOOLEAN DEFAULT FALSE,
  created_by BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dm_participants (
  thread_id BIGINT REFERENCES dm_threads(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('member','admin')) DEFAULT 'member',
  last_read_at TIMESTAMPTZ,
  PRIMARY KEY (thread_id, user_id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  type TEXT, ref_kind TEXT, ref_id BIGINT,
  payload JSONB, is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS notifications_user_idx ON notifications (user_id, is_read, created_at DESC);

CREATE TABLE IF NOT EXISTS content_labels (
  id BIGSERIAL PRIMARY KEY,
  content_kind TEXT, content_id BIGINT,
  label TEXT, confidence NUMERIC(5,4), source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reports (
  id BIGSERIAL PRIMARY KEY,
  reporter_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  content_kind TEXT, content_id BIGINT,
  reason TEXT, details TEXT,
  created_at TIMESTAMPTZ DEFAULT now(), status TEXT DEFAULT 'open'
);

CREATE TABLE IF NOT EXISTS moderation_cases (
  id BIGSERIAL PRIMARY KEY,
  content_kind TEXT, content_id BIGINT,
  state TEXT CHECK (state IN ('open','actioned','dismissed','appealed')) DEFAULT 'open',
  actions JSONB, reviewer_id BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER moderation_cases_set_updated_at BEFORE UPDATE ON moderation_cases
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TABLE IF NOT EXISTS subscriptions (
  id BIGSERIAL PRIMARY KEY,
  creator_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  tier_name TEXT, monthly_price_cents INT CHECK (monthly_price_cents>=0),
  perks JSONB, is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscriber_memberships (
  id BIGSERIAL PRIMARY KEY,
  subscription_id BIGINT REFERENCES subscriptions(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('active','paused','canceled')) DEFAULT 'active',
  renews_at TIMESTAMPTZ, created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (subscription_id, user_id)
);

CREATE TABLE IF NOT EXISTS tips (
  id BIGSERIAL PRIMARY KEY,
  from_user BIGINT REFERENCES users(id),
  to_user BIGINT REFERENCES users(id),
  amount_cents INT CHECK (amount_cents>0),
  currency TEXT, message TEXT, created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shops (
  id BIGSERIAL PRIMARY KEY,
  owner_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT, description TEXT, currency TEXT DEFAULT 'INR',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  shop_id BIGINT REFERENCES shops(id) ON DELETE CASCADE,
  title TEXT, description TEXT, price_cents INT, currency TEXT,
  sku TEXT, stock INT, images JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  buyer_id BIGINT REFERENCES users(id),
  shop_id BIGINT REFERENCES shops(id),
  amount_cents INT, currency TEXT, status TEXT,
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TABLE IF NOT EXISTS payouts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  amount_cents INT, currency TEXT,
  status TEXT, initiated_at TIMESTAMPTZ, settled_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS feature_flags (
  key TEXT PRIMARY KEY, description TEXT
);

CREATE TABLE IF NOT EXISTS flag_assignments (
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  flag_key TEXT REFERENCES feature_flags(key) ON DELETE CASCADE,
  variant TEXT, assigned_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, flag_key)
);

-- Vector tables
CREATE TABLE IF NOT EXISTS user_embeddings (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  vec vector(384)
);

CREATE TABLE IF NOT EXISTS content_embeddings (
  kind TEXT NOT NULL,
  id BIGINT NOT NULL,
  vec vector(384),
  PRIMARY KEY (kind, id)
);

CREATE TABLE IF NOT EXISTS sound_embeddings (
  sound_id BIGINT PRIMARY KEY REFERENCES sounds(id) ON DELETE CASCADE,
  vec vector(384)
);