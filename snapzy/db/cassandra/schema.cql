-- Keyspace
CREATE KEYSPACE IF NOT EXISTS snapzy WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

USE snapzy;

-- Timeline feed per user
CREATE TABLE IF NOT EXISTS timeline_user_feed (
  user_id BIGINT,
  ts_time TIMEUUID,
  content_kind TEXT,
  content_id BIGINT,
  author_id BIGINT,
  PRIMARY KEY ((user_id), ts_time)
) WITH CLUSTERING ORDER BY (ts_time DESC);

-- Reactions by content
CREATE TABLE IF NOT EXISTS reactions_by_content (
  content_kind TEXT,
  content_id BIGINT,
  ts_time TIMEUUID,
  user_id BIGINT,
  emoji TEXT,
  PRIMARY KEY ((content_kind, content_id), ts_time)
) WITH CLUSTERING ORDER BY (ts_time DESC);

-- DM messages by thread
CREATE TABLE IF NOT EXISTS dm_messages (
  thread_id BIGINT,
  ts_time TIMEUUID,
  sender_id BIGINT,
  type TEXT,
  body TEXT,
  PRIMARY KEY ((thread_id), ts_time)
) WITH CLUSTERING ORDER BY (ts_time DESC);

-- Notifications stream per user (optional consumption)
CREATE TABLE IF NOT EXISTS notifications_stream (
  user_id BIGINT,
  ts_time TIMEUUID,
  type TEXT,
  payload TEXT,
  PRIMARY KEY ((user_id), ts_time)
) WITH CLUSTERING ORDER BY (ts_time DESC);