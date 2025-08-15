import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id!: string;

	@Index({ unique: true })
	@Column({ type: 'citext' })
	handle!: string;

	@Column({ type: 'text', nullable: true })
	name!: string | null;

	@Index({ unique: true })
	@Column({ type: 'citext', nullable: true })
	email!: string | null;

	@Index({ unique: true })
	@Column({ type: 'text', nullable: true })
	phone!: string | null;

	@Column({ type: 'text' })
	password_hash!: string;

	@Column({ type: 'text', nullable: true })
	avatar_url!: string | null;

	@Column({ type: 'boolean', default: false })
	is_verified!: boolean;

	@Column({ type: 'text', default: 'personal' })
	account_type!: 'personal' | 'creator' | 'business';

	@Column({ type: 'text', nullable: true })
	country_code!: string | null;

	@Column({ type: 'text', nullable: true })
	language!: string | null;

	@CreateDateColumn({ type: 'timestamptz' })
	created_at!: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updated_at!: Date;
}