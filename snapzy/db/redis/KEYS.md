# Redis key schema

- session:{sessionId}
  - type: string (JWT or session blob)
  - TTL: ACCESS_TOKEN_TTL / REFRESH_TOKEN_TTL respectively

- rate:{ip}:{route}
  - type: integer counter for rate limiting
  - TTL: RATE_LIMIT_DURATION seconds

- otp:{userId}
  - type: string (OTP code hash)
  - TTL: 300 seconds

- ws:presence:{threadId}
  - type: set of userIds online in DM thread
  - TTL: none (managed via expirations on member heartbeats)

- ws:heartbeat:{userId}
  - type: string last seen timestamp
  - TTL: 60 seconds

- feed:hot
  - type: zset (contentId score)
  - TTL: 3600 seconds

- flags:{userId}
  - type: hash of feature flag overrides
  - TTL: none

- media:signed:{key}
  - type: string (pre-signed URL)
  - TTL: short-lived (e.g., 300 seconds)