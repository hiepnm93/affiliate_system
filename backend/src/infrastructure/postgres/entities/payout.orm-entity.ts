import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { AffiliateOrmEntity } from './affiliate.orm-entity';
import { CommissionOrmEntity } from './commission.orm-entity';
import {
  PayoutStatus,
  PaymentMethod,
} from '../../../domains/payout/entities/payout.entity';

@Entity('payouts')
@Index(['affiliateId', 'status'])
@Index(['status', 'requestedAt'])
export class PayoutOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'affiliate_id' })
  @Index()
  affiliateId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'text' : 'enum',
    enum: PaymentMethod,
    name: 'payment_method',
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'text' : 'enum',
    enum: PayoutStatus,
    default: PayoutStatus.PENDING,
  })
  @Index()
  status: PayoutStatus;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamp',
    name: 'requested_at',
  })
  requestedAt: Date;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamp',
    name: 'processed_at',
    nullable: true,
  })
  processedAt?: Date;

  @Column({ type: 'text', name: 'admin_notes', nullable: true })
  adminNotes?: string;

  @Column({ type: 'text', name: 'payment_details', nullable: true })
  paymentDetails?: string;

  @Column({ type: 'text', name: 'failure_reason', nullable: true })
  failureReason?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => AffiliateOrmEntity)
  @JoinColumn({ name: 'affiliate_id' })
  affiliate: AffiliateOrmEntity;

  @OneToMany(() => CommissionOrmEntity, (commission) => commission.payout)
  commissions: CommissionOrmEntity[];
}
