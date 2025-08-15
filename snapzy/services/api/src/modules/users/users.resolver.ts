import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserGraph } from './users.types';

@Resolver(() => UserGraph)
export class UsersResolver {
	constructor(private readonly users: UsersService) {}

	@Query(() => [UserGraph])
	async usersList(@Args('limit', { type: () => Number, nullable: true }) limit?: number) {
		return this.users.listUsers(limit ?? 20);
	}

	@Query(() => UserGraph, { nullable: true })
	async userByHandle(@Args('handle', { type: () => String }) handle: string) {
		return this.users.findByHandle(handle);
	}

	@Mutation(() => UserGraph)
	async createUser(
		@Args('handle') handle: string,
		@Args('email', { nullable: true }) email: string | null,
		@Args('password') password: string,
		@Args('name', { nullable: true }) name: string | null,
	) {
		return this.users.createUser({ handle, email, password, name });
	}
}