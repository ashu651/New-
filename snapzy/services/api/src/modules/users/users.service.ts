import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity) private readonly repo: Repository<UserEntity>,
	) {}

	async createUser(params: { handle: string; email?: string | null; password: string; name?: string | null }): Promise<UserEntity> {
		const password_hash = await argon2.hash(params.password);
		const user = this.repo.create({ handle: params.handle, email: params.email ?? null, password_hash, name: params.name ?? null });
		const saved = await this.repo.save(user);
		return saved;
	}

	async findById(id: string): Promise<UserEntity | null> {
		return this.repo.findOne({ where: { id } });
	}

	async findByHandle(handle: string): Promise<UserEntity | null> {
		return this.repo.findOne({ where: { handle } });
	}

	async verifyPassword(user: UserEntity, password: string): Promise<boolean> {
		return argon2.verify(user.password_hash, password);
	}

	async listUsers(limit = 20): Promise<UserEntity[]> {
		return this.repo.find({ take: limit, order: { created_at: 'DESC' } });
	}
}