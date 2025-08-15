import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly users: UsersService) {}

	@Get()
	async list(@Query('limit') limit?: string) {
		return this.users.listUsers(limit ? Number(limit) : 20);
	}

	@Get(':handle')
	async byHandle(@Param('handle') handle: string) {
		return this.users.findByHandle(handle);
	}
}