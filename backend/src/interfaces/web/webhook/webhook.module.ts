import { Module } from '@nestjs/common';
import { ApplicationModule } from '../../../application/application.module';
import { PaymentWebhookController } from './payment-webhook.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [PaymentWebhookController],
})
export class WebhookModule {}
