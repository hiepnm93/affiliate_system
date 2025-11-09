import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// ORM Entities
import { UserOrmEntity } from './postgres/entities/user.orm-entity';
import { AffiliateOrmEntity } from './postgres/entities/affiliate.orm-entity';
import { ReferredUserOrmEntity } from './postgres/entities/referred-user.orm-entity';
import { ReferralEventOrmEntity } from './postgres/entities/referral-event.orm-entity';
import { CampaignOrmEntity } from './postgres/entities/campaign.orm-entity';
import { TransactionOrmEntity } from './postgres/entities/transaction.orm-entity';
import { CommissionOrmEntity } from './postgres/entities/commission.orm-entity';

// Repository Implementations
import { UserRepositoryImpl } from './postgres/repositories/user.repository.impl';
import { AffiliateRepositoryImpl } from './postgres/repositories/affiliate.repository.impl';
import { ReferredUserRepositoryImpl } from './postgres/repositories/referred-user.repository.impl';
import { ReferralEventRepositoryImpl } from './postgres/repositories/referral-event.repository.impl';
import { CampaignRepositoryImpl } from './postgres/repositories/campaign.repository.impl';
import { TransactionRepositoryImpl } from './postgres/repositories/transaction.repository.impl';
import { CommissionRepositoryImpl } from './postgres/repositories/commission.repository.impl';

// Repository Tokens
import { USER_REPOSITORY } from '../domains/user/repositories/user.repository.interface';
import { AFFILIATE_REPOSITORY } from '../domains/affiliate/repositories/affiliate.repository.interface';
import { REFERRED_USER_REPOSITORY } from '../domains/affiliate/repositories/referred-user.repository.interface';
import { REFERRAL_EVENT_REPOSITORY } from '../domains/affiliate/repositories/referral-event.repository.interface';
import { CAMPAIGN_REPOSITORY } from '../domains/campaign/repositories/campaign.repository.interface';
import { TRANSACTION_REPOSITORY } from '../domains/transaction/repositories/transaction.repository.interface';
import { COMMISSION_REPOSITORY } from '../domains/commission/repositories/commission.repository.interface';

// Services
import { TrackingService } from './redis/tracking.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      UserOrmEntity,
      AffiliateOrmEntity,
      ReferredUserOrmEntity,
      ReferralEventOrmEntity,
      CampaignOrmEntity,
      TransactionOrmEntity,
      CommissionOrmEntity,
    ]),
  ],
  providers: [
    // User Repository
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
    // Affiliate Repository
    {
      provide: AFFILIATE_REPOSITORY,
      useClass: AffiliateRepositoryImpl,
    },
    // Referred User Repository
    {
      provide: REFERRED_USER_REPOSITORY,
      useClass: ReferredUserRepositoryImpl,
    },
    // Referral Event Repository
    {
      provide: REFERRAL_EVENT_REPOSITORY,
      useClass: ReferralEventRepositoryImpl,
    },
    // Campaign Repository
    {
      provide: CAMPAIGN_REPOSITORY,
      useClass: CampaignRepositoryImpl,
    },
    // Transaction Repository
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: TransactionRepositoryImpl,
    },
    // Commission Repository
    {
      provide: COMMISSION_REPOSITORY,
      useClass: CommissionRepositoryImpl,
    },
    // Redis Tracking Service
    TrackingService,
  ],
  exports: [
    USER_REPOSITORY,
    AFFILIATE_REPOSITORY,
    REFERRED_USER_REPOSITORY,
    REFERRAL_EVENT_REPOSITORY,
    CAMPAIGN_REPOSITORY,
    TRANSACTION_REPOSITORY,
    COMMISSION_REPOSITORY,
    TrackingService,
  ],
})
export class InfrastructureModule {}
