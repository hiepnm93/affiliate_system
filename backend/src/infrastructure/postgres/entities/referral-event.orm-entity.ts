import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ReferralEventType } from '../../../domains/affiliate/entities/referral-event.entity';
import { AffiliateOrmEntity } from './affiliate.orm-entity';
import { ReferredUserOrmEntity } from './referred-user.orm-entity';

@Entity('referral_events')
@Index(['affiliateId', 'eventType', 'timestamp'])
@Index(['ipAddress', 'timestamp'])
export class ReferralEventOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  affiliateId: number;

  @ManyToOne(() => AffiliateOrmEntity)
  @JoinColumn({ name: 'affiliateId' })
  affiliate: AffiliateOrmEntity;

  @Column({ nullable: true })
  referredUserId: number | null;

  @ManyToOne(() => ReferredUserOrmEntity, { nullable: true })
  @JoinColumn({ name: 'referredUserId' })
  referredUser: ReferredUserOrmEntity | null;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'text' : 'enum',
    enum: ReferralEventType,
  })
  @Index()
  eventType: ReferralEventType;

  @Column()
  ipAddress: string;

  @Column({ type: 'text' })
  userAgent: string;

  @Column({ nullable: true })
  cookieId: string | null;

  @Column({ nullable: true, type: 'text' })
  referrer: string | null;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'simple-json' : 'jsonb',
    nullable: true,
    ...(process.env.NODE_ENV !== 'test' && { default: {} }),
  })
  metadata: Record<string, any>;

  @CreateDateColumn()
  @Index()
  timestamp: Date;
}
