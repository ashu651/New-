import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ type: 'citext', unique: true })
  handle!: string;

  @Column({ type: 'text', nullable: true })
  name!: string | null;

  @Column({ type: 'citext', unique: true, nullable: true })
  email!: string | null;

  @Column({ type: 'text', unique: true, nullable: true })
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