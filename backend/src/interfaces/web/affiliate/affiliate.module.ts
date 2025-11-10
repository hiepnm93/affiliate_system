import { Module } from '@nestjs/common';
import { ApplicationModule } from '../../../application/application.module';
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module';
import { AffiliateController } from './affiliate.controller';
import { AffiliatePayoutController } from './payout.controller';

@Module({
  imports: [ApplicationModule, InfrastructureModule],
  controllers: [AffiliateController, AffiliatePayoutController],
})
export class AffiliateModule {}
