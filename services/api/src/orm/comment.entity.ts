import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comments')
@Index(['post_id', 'created_at'])
export class CommentEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ type: 'bigint' })
  post_id!: string;

  @Column({ type: 'bigint' })
  author_id!: string;

  @Column({ type: 'bigint', nullable: true })
  parent_id!: string | null;

  @Column({ type: 'text' })
  text!: string;

  @Column({ type: 'jsonb', nullable: true })
  safety_flags!: Record<string, unknown> | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}