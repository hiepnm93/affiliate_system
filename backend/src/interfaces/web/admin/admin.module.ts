import { Module } from '@nestjs/common';
import { ApplicationModule } from '../../../application/application.module';
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module';
import { CampaignController } from './campaign.controller';
import { CommissionController } from './commission.controller';
import { AdminPayoutController } from './payout.controller';
import { AdminReportsController } from './reports.controller';

@Module({
  imports: [ApplicationModule, InfrastructureModule],
  controllers: [
    CampaignController,
    CommissionController,
    AdminPayoutController,
    AdminReportsController,
  ],
})
export class AdminModule {}
