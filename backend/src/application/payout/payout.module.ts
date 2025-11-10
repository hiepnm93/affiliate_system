import { Module } from '@nestjs/common';
import { RequestPayoutUseCase } from './request-payout.use-case';
import { ProcessPayoutUseCase } from './process-payout.use-case';

@Module({
  providers: [RequestPayoutUseCase, ProcessPayoutUseCase],
  exports: [RequestPayoutUseCase, ProcessPayoutUseCase],
})
export class PayoutApplicationModule {}
