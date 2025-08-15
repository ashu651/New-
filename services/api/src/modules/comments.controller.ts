import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from '../orm/comment.entity';

@Controller('comments')
export class CommentsController {
  constructor(@InjectRepository(CommentEntity) private readonly comments: Repository<CommentEntity>) {}

  @Get('post/:postId')
  async list(@Param('postId') postId: string) {
    return this.comments.find({ where: { post_id: postId }, order: { created_at: 'ASC' }, take: 100 });
  }

  @Post('post/:postId')
  async create(@Param('postId') postId: string, @Body() body: { author_id: string; text: string; parent_id?: string | null }) {
    const c = this.comments.create({ post_id: postId, author_id: body.author_id, text: body.text, parent_id: body.parent_id ?? null });
    return this.comments.save(c);
  }
}