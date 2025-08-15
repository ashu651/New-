import { Controller, Get, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Placeholder entity interface for raw query; in real code create TypeORM entity
interface Notification { id: string; type: string; payload: any; is_read: boolean; created_at: string }

@Controller('notifications')
export class NotificationsController {
  constructor(@InjectRepository(Object) private readonly repo: Repository<any>) {}

  @Get(':userId')
  async list(@Param('userId') userId: string) {
    const rows = await this.repo.query('SELECT id, type, payload, is_read, created_at FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50', [userId]);
    return rows as Notification[];
  }
}