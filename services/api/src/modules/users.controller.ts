import { Controller, Get, Param, Query } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private readonly db: DataSource) {}

  @Get()
  async list(@Query('q') q?: string) {
    if (q) {
      return this.db.query('SELECT id, handle, name, avatar_url FROM users WHERE handle ILIKE $1 OR name ILIKE $1 LIMIT 20', [`%${q}%`]);
    }
    return this.db.query('SELECT id, handle, name, avatar_url FROM users ORDER BY created_at DESC LIMIT 50');
  }

  @Get(':id')
  async profile(@Param('id') id: string) {
    const [user] = await this.db.query('SELECT id, handle, name, avatar_url, is_verified FROM users WHERE id=$1', [id]);
    const [{ count: posts }] = await this.db.query('SELECT COUNT(*)::int as count FROM posts WHERE author_id=$1', [id]);
    const [{ count: followers }] = await this.db.query('SELECT COUNT(*)::int as count FROM follows WHERE followee_id=$1', [id]);
    const [{ count: following }] = await this.db.query('SELECT COUNT(*)::int as count FROM follows WHERE follower_id=$1', [id]);
    return { user, stats: { posts, followers, following } };
  }
}