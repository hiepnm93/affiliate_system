import { Module } from '@nestjs/common';
import { ApplicationModule } from '../../../application/application.module';
import { CampaignController } from './campaign.controller';
import { CommissionController } from './commission.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [CampaignController, CommissionController],
})
export class AdminModule {}
