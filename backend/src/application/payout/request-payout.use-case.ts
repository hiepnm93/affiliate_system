import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import {
  PayoutEntity,
  PaymentMethod,
} from '../../domains/payout/entities/payout.entity';
import {
  IPayoutRepository,
  PAYOUT_REPOSITORY,
} from '../../domains/payout/repositories/payout.repository.interface';
import {
  ICommissionRepository,
  COMMISSION_REPOSITORY,
} from '../../domains/commission/repositories/commission.repository.interface';
import { CommissionStatus } from '../../domains/commission/entities/commission.entity';

export interface RequestPayoutDto {
  affiliateId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDetails?: string; // Bank account, e-wallet details, etc.
}

@Injectable()
export class RequestPayoutUseCase {
  private readonly MIN_PAYOUT_THRESHOLD = 50; // Minimum $50 for payout

  constructor(
    @Inject(PAYOUT_REPOSITORY)
    private readonly payoutRepository: IPayoutRepository,
    @Inject(COMMISSION_REPOSITORY)
    private readonly commissionRepository: ICommissionRepository,
  ) {}

  async execute(dto: RequestPayoutDto): Promise<PayoutEntity> {
    // 1. Validate amount >= minimum threshold
    if (dto.amount < this.MIN_PAYOUT_THRESHOLD) {
      throw new BadRequestException(
        `Minimum payout amount is $${this.MIN_PAYOUT_THRESHOLD}`,
      );
    }

    // 2. Calculate available balance (approved commissions not yet paid)
    const availableBalance = await this.calculateAvailableBalance(
      dto.affiliateId,
    );

    // 3. Validate requested amount <= available balance
    if (dto.amount > availableBalance) {
      throw new BadRequestException(
        `Insufficient balance. Available: $${availableBalance}, Requested: $${dto.amount}`,
      );
    }

    // 4. Create payout request with status=pending
    const payout = PayoutEntity.create(
      dto.affiliateId,
      dto.amount,
      dto.paymentMethod,
      dto.paymentDetails,
    );

    const createdPayout = await this.payoutRepository.create(payout);

    return createdPayout;
  }

  /**
   * Calculate available balance for affiliate
   * = Sum of approved commissions - sum of already requested payouts (pending/processing/paid)
   */
  private async calculateAvailableBalance(
    affiliateId: number,
  ): Promise<number> {
    // Get all approved commissions (not yet paid)
    const approvedCommissions =
      await this.commissionRepository.findByAffiliateId(
        affiliateId,
        CommissionStatus.APPROVED,
      );

    const totalApproved = approvedCommissions.reduce(
      (sum, commission) => sum + commission.amount,
      0,
    );

    // Get all existing payouts (pending, processing, paid)
    const existingPayouts =
      await this.payoutRepository.findByAffiliateId(affiliateId);

    const totalRequested = existingPayouts
      .filter(
        (payout) =>
          payout.isPending() || payout.isProcessing() || payout.isPaid(),
      )
      .reduce((sum, payout) => sum + payout.amount, 0);

    return totalApproved - totalRequested;
  }
}
