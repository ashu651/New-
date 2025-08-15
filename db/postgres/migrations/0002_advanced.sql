-- Advanced extensions and tables to beat incumbent platforms

-- Communities and membership
CREATE TABLE IF NOT EXISTS communities (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug CITEXT UNIQUE NOT NULL,
  description TEXT,
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS community_members (
  community_id BIGINT REFERENCES communities(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('member','moderator','owner')) DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (community_id, user_id)
);

-- Expertise badges & user badges
CREATE TABLE IF NOT EXISTS expertise_badges (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  criteria JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_badges (
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  badge_id BIGINT REFERENCES expertise_badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, badge_id)
);

-- Smart Albums and rules
CREATE TABLE IF NOT EXISTS albums (
  id BIGSERIAL PRIMARY KEY,
  owner_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_smart BOOLEAN DEFAULT TRUE,
  rules JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS album_items (
  album_id BIGINT REFERENCES albums(id) ON DELETE CASCADE,
  content_kind TEXT CHECK (content_kind IN ('post','reel')) NOT NULL,
  content_id BIGINT NOT NULL,
  added_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (album_id, content_kind, content_id)
);

-- Shot templates for capture
CREATE TABLE IF NOT EXISTS shot_templates (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  steps JSONB NOT NULL,
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Drafts with versioning
CREATE TABLE IF NOT EXISTS drafts (
  id BIGSERIAL PRIMARY KEY,
  owner_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  kind TEXT CHECK (kind IN ('post','reel','story')) NOT NULL,
  title TEXT,
  current_version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS draft_versions (
  draft_id BIGINT REFERENCES drafts(id) ON DELETE CASCADE,
  version INT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (draft_id, version)
);

-- Topic circles for interest-based sharing
CREATE TABLE IF NOT EXISTS topic_circles (
  id BIGSERIAL PRIMARY KEY,
  owner_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS topic_circle_members (
  circle_id BIGINT REFERENCES topic_circles(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (circle_id, user_id)
);

-- Sponsor marketplace & escrow
CREATE TABLE IF NOT EXISTS sponsor_campaigns (
  id BIGSERIAL PRIMARY KEY,
  brand_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  title TEXT, brief TEXT, budget_cents INT,
  created_at TIMESTAMPTZ DEFAULT now(), status TEXT DEFAULT 'open'
);

CREATE TABLE IF NOT EXISTS sponsor_deals (
  id BIGSERIAL PRIMARY KEY,
  campaign_id BIGINT REFERENCES sponsor_campaigns(id) ON DELETE CASCADE,
  creator_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  amount_cents INT, currency TEXT DEFAULT 'USD',
  escrow_status TEXT CHECK (escrow_status IN ('pending','funded','released','refunded')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS escrow_transactions (
  id BIGSERIAL PRIMARY KEY,
  deal_id BIGINT REFERENCES sponsor_deals(id) ON DELETE CASCADE,
  kind TEXT CHECK (kind IN ('fund','release','refund')) NOT NULL,
  amount_cents INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Affiliate graph
CREATE TABLE IF NOT EXISTS affiliate_edges (
  id BIGSERIAL PRIMARY KEY,
  promoter_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  rate_bps INT CHECK (rate_bps BETWEEN 0 AND 10000) DEFAULT 1000,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- A/B experiments (separate from feature flags)
CREATE TABLE IF NOT EXISTS ab_experiments (
  key TEXT PRIMARY KEY,
  description TEXT,
  variants JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ab_assignments (
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  experiment_key TEXT REFERENCES ab_experiments(key) ON DELETE CASCADE,
  variant TEXT NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, experiment_key)
);

-- Wellbeing settings
CREATE TABLE IF NOT EXISTS user_wellbeing_settings (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  hide_like_counts BOOLEAN DEFAULT FALSE,
  restrict_dms BOOLEAN DEFAULT FALSE,
  quiet_hours JSONB,
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);

-- Content quality scores
CREATE TABLE IF NOT EXISTS content_quality (
  content_kind TEXT NOT NULL,
  content_id BIGINT NOT NULL,
  score NUMERIC(6,4) DEFAULT 0,
  signals JSONB,
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (content_kind, content_id)
);