import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { RewardType, CampaignStatus, MultiLevelConfig } from '../../../domains/campaign/entities/campaign.entity';

@Entity('campaigns')
export class CampaignOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'timestamp' })
  @Index()
  startDate: Date;

  @Column({ type: 'timestamp' })
  @Index()
  endDate: Date;

  @Column({
    type: 'enum',
    enum: RewardType,
  })
  rewardType: RewardType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rewardValue: number;

  @Column({ type: 'jsonb' })
  multiLevelConfig: MultiLevelConfig;

  @Column({ default: 30 })
  cookieTTL: number;

  @Column({
    type: 'enum',
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
