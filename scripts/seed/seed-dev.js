#!/usr/bin/env node
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const { Client: OSClient } = require('@opensearch-project/opensearch');

(async () => {
  const pg = new Client({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432,
    user: process.env.POSTGRES_USER || 'snapzy',
    password: process.env.POSTGRES_PASSWORD || 'snapzy',
    database: process.env.POSTGRES_DB || 'snapzy'
  });
  await pg.connect();

  const passwordHash = await bcrypt.hash('password123', 10);
  const userRes = await pg.query(
    `INSERT INTO users(handle, name, email, password_hash, is_verified)
     VALUES ($1,$2,$3,$4,true)
     ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name
     RETURNING id, handle`,
    ['demo', 'Demo User', 'demo@snapzy.local', passwordHash]
  );
  const user = userRes.rows[0];
  console.log('Seeded user', user);

  const postRes = await pg.query(
    `INSERT INTO posts(author_id, kind, caption)
     VALUES ($1,'image','Hello Snapzy! #firstpost') RETURNING id`,
    [user.id]
  );
  console.log('Seeded post', postRes.rows[0]);

  const os = new OSClient({ node: `http://${process.env.OPENSEARCH_HOST || 'localhost'}:${process.env.OPENSEARCH_PORT || 9200}` });
  await os.indices.create({ index: 'users_idx' }, { ignore: [400] });
  await os.index({ index: 'users_idx', id: String(user.id), body: { id: user.id, handle: 'demo', name: 'Demo User', is_verified: true } });
  console.log('Indexed user in OpenSearch');

  await pg.end();
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });