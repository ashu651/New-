import { Body, Controller, Get, Param, Post as HttpPost, UseGuards, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../orm/post.entity';
import { JwtAuthGuard } from './common/jwt-auth.guard';
import { CurrentUser } from './common/current-user.decorator';
import { DataSource } from 'typeorm';

@Controller('posts')
export class PostsController {
  constructor(@InjectRepository(PostEntity) private readonly posts: Repository<PostEntity>, private readonly db?: DataSource) {}

  @Get()
  async listByAuthor(@Query('author_id') authorId?: string) {
    if (!authorId) return [];
    return this.db!.query('SELECT id, caption, kind, created_at FROM posts WHERE author_id=$1 ORDER BY created_at DESC LIMIT 30', [authorId]);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.posts.findOneBy({ id });
  }

  @HttpPost()
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: { sub: string },
    @Body() body: { kind: 'image' | 'video' | 'carousel'; caption?: string | null; visibility?: 'public' | 'followers' | 'private' }
  ) {
    const post = this.posts.create({ author_id: user.sub, kind: body.kind, caption: body.caption ?? null, visibility: body.visibility ?? 'public' });
    return this.posts.save(post);
  }
}