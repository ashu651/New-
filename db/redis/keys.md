# Redis Keys

- session:{sessionId}
  - Type: String (JSON of { userId, deviceId, createdAt, expiresAt })
  - TTL: matches `sessions.expires_at`

- ratelimit:{scope}:{id}
  - Type: String (counter)
  - TTL: sliding window (e.g., 60s)

- ws:connections:{userId}
  - Type: Set of connection ids
  - TTL: none (managed on connect/disconnect)

- notifications:unread:{userId}
  - Type: ZSET score=timestamp value=notificationId
  - TTL: none

- feed:hot
  - Type: ZSET score=rank value=contentKey
  - TTL: 10 minutes (edge-cached hot feeds)

- featureflags:{userId}
  - Type: Hash of { flagKey: variant }
  - TTL: 1 hour

- otp:{userId}
  - Type: String (TOTP secret or challenge)
  - TTL: 10 minutes

- media:sign:{hash}
  - Type: String (short-lived presign cache)
  - TTL: 5 minutes