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
import { AffiliateOrmEntity } from './affiliate.orm-entity';
import { UserOrmEntity } from './user.orm-entity';

@Entity('referred_users')
export class ReferredUserOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  email: string;

  @Column({ nullable: true })
  userId: number | null;

  @ManyToOne(() => UserOrmEntity, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: UserOrmEntity | null;

  @Column()
  @Index()
  referralCode: string;

  @Column()
  @Index()
  affiliateId: number;

  @ManyToOne(() => AffiliateOrmEntity)
  @JoinColumn({ name: 'affiliateId' })
  affiliate: AffiliateOrmEntity;

  @Column({ nullable: true })
  cookieId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
