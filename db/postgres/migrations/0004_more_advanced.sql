-- E2E user keys for DMs
CREATE TABLE IF NOT EXISTS dm_user_keys (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  public_key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Appeals referencing moderation cases
CREATE TABLE IF NOT EXISTS appeals (
  id BIGSERIAL PRIMARY KEY,
  case_id BIGINT REFERENCES moderation_cases(id) ON DELETE CASCADE,
  appellant_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  reason TEXT,
  status TEXT CHECK (status IN ('open','reviewing','accepted','rejected')) DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);

-- Story highlights
CREATE TABLE IF NOT EXISTS story_highlights (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS story_highlight_items (
  highlight_id BIGINT REFERENCES story_highlights(id) ON DELETE CASCADE,
  story_id BIGINT REFERENCES stories(id) ON DELETE CASCADE,
  seq SMALLINT NOT NULL,
  PRIMARY KEY (highlight_id, story_id)
);

-- Custodial wallets and transactions (optional)
CREATE TABLE IF NOT EXISTS wallets (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  currency TEXT DEFAULT 'USD',
  balance_cents BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  amount_cents BIGINT NOT NULL,
  kind TEXT CHECK (kind IN ('credit','debit')) NOT NULL,
  ref_kind TEXT, ref_id BIGINT,
  created_at TIMESTAMPTZ DEFAULT now()
);