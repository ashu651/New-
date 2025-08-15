import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { UsersController } from './users.controller';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
	providers: [UsersService, UsersResolver],
	controllers: [UsersController],
	exports: [UsersService],
})
export class UsersModule {}