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
import { CommissionStatus } from '../../../domains/commission/entities/commission.entity';
import { AffiliateOrmEntity } from './affiliate.orm-entity';
import { TransactionOrmEntity } from './transaction.orm-entity';
import { CampaignOrmEntity } from './campaign.orm-entity';

@Entity('commissions')
@Index(['affiliateId', 'status'])
@Index(['transactionId'])
export class CommissionOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  affiliateId: number;

  @ManyToOne(() => AffiliateOrmEntity)
  @JoinColumn({ name: 'affiliateId' })
  affiliate: AffiliateOrmEntity;

  @Column()
  transactionId: number;

  @ManyToOne(() => TransactionOrmEntity)
  @JoinColumn({ name: 'transactionId' })
  transaction: TransactionOrmEntity;

  @Column()
  campaignId: number;

  @ManyToOne(() => CampaignOrmEntity)
  @JoinColumn({ name: 'campaignId' })
  campaign: CampaignOrmEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  level: number;

  @Column({
    type: 'enum',
    enum: CommissionStatus,
    default: CommissionStatus.PENDING,
  })
  @Index()
  status: CommissionStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ nullable: true })
  payoutId: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
