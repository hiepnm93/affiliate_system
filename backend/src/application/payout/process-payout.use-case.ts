import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PayoutEntity,
  PayoutStatus,
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

export interface ProcessPayoutDto {
  payoutId: number;
  status: 'paid' | 'failed';
  adminNotes?: string;
  failureReason?: string;
}

@Injectable()
export class ProcessPayoutUseCase {
  constructor(
    @Inject(PAYOUT_REPOSITORY)
    private readonly payoutRepository: IPayoutRepository,
    @Inject(COMMISSION_REPOSITORY)
    private readonly commissionRepository: ICommissionRepository,
  ) {}

  async execute(dto: ProcessPayoutDto): Promise<PayoutEntity> {
    // 1. Get payout
    const payout = await this.payoutRepository.findById(dto.payoutId);
    if (!payout) {
      throw new NotFoundException('Payout not found');
    }

    // 2. Validate payout can be processed
    if (!payout.canProcess()) {
      throw new NotFoundException(
        `Payout cannot be processed. Current status: ${payout.status}`,
      );
    }

    // 3. Update payout status
    const updates: Partial<PayoutEntity> = {
      status: dto.status === 'paid' ? PayoutStatus.PAID : PayoutStatus.FAILED,
      processedAt: new Date(),
      adminNotes: dto.adminNotes,
    };

    if (dto.status === 'failed') {
      updates.failureReason = dto.failureReason;
    }

    const updatedPayout = await this.payoutRepository.update(
      dto.payoutId,
      updates,
    );

    // 4. If paid, mark related commissions as PAID
    if (dto.status === 'paid') {
      await this.markCommissionsAsPaid(payout.affiliateId, dto.payoutId);
    }

    return updatedPayout!;
  }

  /**
   * Mark approved commissions as paid and link them to payout
   * This marks commissions equal to the payout amount
   */
  private async markCommissionsAsPaid(
    affiliateId: number,
    payoutId: number,
  ): Promise<void> {
    // Get payout to know the amount
    const payout = await this.payoutRepository.findById(payoutId);
    if (!payout) return;

    // Get approved commissions for this affiliate (oldest first)
    const approvedCommissions =
      await this.commissionRepository.findByAffiliateId(
        affiliateId,
        CommissionStatus.APPROVED,
      );

    // Mark commissions as paid up to payout amount
    let remaining = payout.amount;
    for (const commission of approvedCommissions) {
      if (remaining <= 0) break;

      if (commission.amount <= remaining) {
        // Mark entire commission as paid
        commission.markAsPaid(payoutId);
        await this.commissionRepository.update(commission.id, {
          status: CommissionStatus.PAID,
          payoutId: payoutId,
        });
        remaining -= commission.amount;
      }
    }
  }
}
