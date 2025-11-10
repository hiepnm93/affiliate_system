import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import {
  RewardType,
  CampaignStatus,
  MultiLevelConfig,
} from '../../../domains/campaign/entities/campaign.entity';

@Entity('campaigns')
export class CampaignOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamp',
  })
  @Index()
  startDate: Date;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamp',
  })
  @Index()
  endDate: Date;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'text' : 'enum',
    enum: RewardType,
  })
  rewardType: RewardType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rewardValue: number;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'simple-json' : 'jsonb',
  })
  multiLevelConfig: MultiLevelConfig;

  @Column({ default: 30 })
  cookieTTL: number;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'text' : 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.ACTIVE,
  })
  @Index()
  status: CampaignStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
