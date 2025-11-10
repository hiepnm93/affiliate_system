import { Controller, Post, Body } from '@nestjs/common';
import { RecordTransactionUseCase } from '../../../application/transaction/record-transaction.use-case';
import { CalculateCommissionUseCase } from '../../../application/commission/calculate-commission.use-case';

interface PaymentWebhookDto {
  externalId: string;
  referredUserId: number;
  amount: number;
  currency: string;
  status: string;
  metadata?: Record<string, any>;
}

@Controller('webhook/payment')
export class PaymentWebhookController {
  constructor(
    private readonly recordTransactionUseCase: RecordTransactionUseCase,
    private readonly calculateCommissionUseCase: CalculateCommissionUseCase,
  ) {}

  @Post()
  async handlePaymentWebhook(@Body() dto: PaymentWebhookDto) {
    try {
      // 1. Record transaction
      const transaction = await this.recordTransactionUseCase.execute({
        referredUserId: dto.referredUserId,
        amount: dto.amount,
        currency: dto.currency,
        externalId: dto.externalId,
        metadata: dto.metadata,
      });

      // 2. Calculate commissions (multi-level)
      const commissions = await this.calculateCommissionUseCase.execute(
        transaction.id,
      );

      return {
        success: true,
        transactionId: transaction.id,
        commissionsCreated: commissions.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
