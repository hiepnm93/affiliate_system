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
import { AffiliateStatus } from '../../../domains/affiliate/entities/affiliate.entity';
import { UserOrmEntity } from './user.orm-entity';

@Entity('affiliates')
export class AffiliateOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Index()
  userId: number;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'userId' })
  user: UserOrmEntity;

  @Column({ unique: true })
  @Index()
  referralCode: string;

  @Column({ nullable: true })
  parentAffiliateId: number | null;

  @ManyToOne(() => AffiliateOrmEntity, { nullable: true })
  @JoinColumn({ name: 'parentAffiliateId' })
  parentAffiliate: AffiliateOrmEntity | null;

  @OneToMany(() => AffiliateOrmEntity, (affiliate) => affiliate.parentAffiliate)
  childAffiliates: AffiliateOrmEntity[];

  @Column({ default: 1 })
  tier: number;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'text' : 'enum',
    enum: AffiliateStatus,
    default: AffiliateStatus.ACTIVE,
  })
  @Index()
  status: AffiliateStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
