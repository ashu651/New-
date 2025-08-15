import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../orm/user.entity';

@Controller('flags')
export class FlagsController {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  @Get(':userId')
  async get(@Param('userId') userId: string) {
    // Placeholder: fetch from Redis or DB flag_assignments; return merged with defaults
    return { userId, flags: { explore_new_ranker: 'treatment', safety_v2: 'control' } };
  }

  @Post(':userId')
  async set(@Param('userId') userId: string, @Body() body: { flags: Record<string, string> }) {
    // Placeholder write; in real impl: upsert into flag_assignments
    return { ok: true, userId, flags: body.flags };
  }
}