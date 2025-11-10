import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { TransactionStatus } from '../../../domains/transaction/entities/transaction.entity';
import { ReferredUserOrmEntity } from './referred-user.orm-entity';

@Entity('transactions')
@Index(['externalId'], { unique: true })
export class TransactionOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  referredUserId: number;

  @ManyToOne(() => ReferredUserOrmEntity)
  @JoinColumn({ name: 'referredUserId' })
  referredUser: ReferredUserOrmEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'text' : 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  @Index()
  status: TransactionStatus;

  @Column({ unique: true })
  externalId: string;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'simple-json' : 'jsonb',
    nullable: true,
    ...(process.env.NODE_ENV !== 'test' && { default: {} }),
  })
  metadata: Record<string, any>;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
