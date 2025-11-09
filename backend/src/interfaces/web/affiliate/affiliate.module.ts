import { Module } from '@nestjs/common';
import { ApplicationModule } from '../../../application/application.module';
import { AffiliateController } from './affiliate.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [AffiliateController],
})
export class AffiliateModule {}
