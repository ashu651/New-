import { Body, Controller, Delete, Post } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly db: DataSource) {}

  @Post()
  async react(@Body() body: { content_kind: 'post' | 'reel' | 'comment'; content_id: string; user_id: string; emoji?: string }) {
    const emoji = body.emoji || 'like';
    await this.db.query(
      `INSERT INTO reactions(content_kind, content_id, user_id, emoji)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (content_kind, content_id, user_id) DO UPDATE SET emoji=EXCLUDED.emoji, created_at=now()`,
      [body.content_kind, body.content_id, body.user_id, emoji]
    );
    return { ok: true };
  }

  @Delete()
  async unreact(@Body() body: { content_kind: 'post' | 'reel' | 'comment'; content_id: string; user_id: string }) {
    await this.db.query(`DELETE FROM reactions WHERE content_kind=$1 AND content_id=$2 AND user_id=$3`, [body.content_kind, body.content_id, body.user_id]);
    return { ok: true };
  }
}