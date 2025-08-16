import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('saves')
export class SavesController {
  constructor(private readonly db: DataSource) {}

  @Post()
  async save(@Body() body: { user_id: string; content_kind: 'post' | 'reel'; content_id: string; collection_id?: string | null }) {
    await this.db.query(
      `INSERT INTO saves(user_id, content_kind, content_id, collection_id)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (user_id, content_kind, content_id) DO NOTHING`,
      [body.user_id, body.content_kind, body.content_id, body.collection_id ?? null]
    );
    return { ok: true };
  }

  @Delete()
  async unsave(@Body() body: { user_id: string; content_kind: 'post' | 'reel'; content_id: string }) {
    await this.db.query(`DELETE FROM saves WHERE user_id=$1 AND content_kind=$2 AND content_id=$3`, [body.user_id, body.content_kind, body.content_id]);
    return { ok: true };
  }

  @Get(':userId')
  async list(@Param('userId') userId: string) {
    const rows = await this.db.query(`SELECT content_kind, content_id, created_at FROM saves WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100`, [userId]);
    return rows;
  }
}