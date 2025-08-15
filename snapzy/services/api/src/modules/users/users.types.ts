import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType('User')
export class UserGraph {
	@Field(() => ID)
	id!: string;

	@Field()
	handle!: string;

	@Field({ nullable: true })
	name?: string | null;

	@Field({ nullable: true })
	email?: string | null;

	@Field({ nullable: true })
	avatar_url?: string | null;

	@Field()
	is_verified!: boolean;
}