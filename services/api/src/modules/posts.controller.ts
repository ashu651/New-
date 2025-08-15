import { Body, Controller, Get, Param, Post as HttpPost, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../orm/post.entity';
import { JwtAuthGuard } from './common/jwt-auth.guard';
import { CurrentUser } from './common/current-user.decorator';

@Controller('posts')
export class PostsController {
  constructor(@InjectRepository(PostEntity) private readonly posts: Repository<PostEntity>) {}

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