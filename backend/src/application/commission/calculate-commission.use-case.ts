import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domains/transaction/repositories/transaction.repository.interface';
import {
  IReferredUserRepository,
  REFERRED_USER_REPOSITORY,
} from '../../domains/affiliate/repositories/referred-user.repository.interface';
import {
  IAffiliateRepository,
  AFFILIATE_REPOSITORY,
} from '../../domains/affiliate/repositories/affiliate.repository.interface';
import {
  ICampaignRepository,
  CAMPAIGN_REPOSITORY,
} from '../../domains/campaign/repositories/campaign.repository.interface';
import {
  ICommissionRepository,
  COMMISSION_REPOSITORY,
} from '../../domains/commission/repositories/commission.repository.interface';
import { CommissionEntity } from '../../domains/commission/entities/commission.entity';
import { RewardType } from '../../domains/campaign/entities/campaign.entity';

@Injectable()
export class CalculateCommissionUseCase {
  private readonly maxAffiliateLevel: number;

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(REFERRED_USER_REPOSITORY)
    private readonly referredUserRepository: IReferredUserRepository,
    @Inject(AFFILIATE_REPOSITORY)
    private readonly affiliateRepository: IAffiliateRepository,
    @Inject(CAMPAIGN_REPOSITORY)
    private readonly campaignRepository: ICampaignRepository,
    @Inject(COMMISSION_REPOSITORY)
    private readonly commissionRepository: ICommissionRepository,
    private readonly configService: ConfigService,
  ) {
    this.maxAffiliateLevel = this.configService.get<number>(
      'MAX_AFFILIATE_LEVELS',
      5,
    );
  }

  async execute(transactionId: number): Promise<CommissionEntity[]> {
    // Check if commissions already calculated (optimization)
    const existingCommissions =
      await this.commissionRepository.findByTransactionId(transactionId);
    if (existingCommissions.length > 0) {
      return existingCommissions; // Already calculated
    }

    // 1. Get transaction
    const transaction =
      await this.transactionRepository.findById(transactionId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    // 2. Get referred user
    const referredUser = await this.referredUserRepository.findById(
      transaction.referredUserId,
    );
    if (!referredUser) {
      throw new NotFoundException('Referred user not found');
    }

    // 3. Get active campaign
    const campaign = await this.campaignRepository.findActiveCampaign(
      transaction.createdAt,
    );
    if (!campaign) {
      // No active campaign, no commissions
      return [];
    }

    // 4. Get affiliate chain (multi-level)
    const affiliateChain = await this.affiliateRepository.findParentChain(
      referredUser.affiliateId,
    );

    // 5. Calculate commissions for each level
    const commissionsToCreate: Omit<
      CommissionEntity,
      'id' | 'createdAt' | 'updatedAt'
    >[] = [];

    for (
      let level = 1;
      level <= Math.min(affiliateChain.length, this.maxAffiliateLevel);
      level++
    ) {
      const affiliate = affiliateChain[level - 1];

      // Get commission percentage/amount for this level
      const commissionRate = campaign.getCommissionForLevel(level);
      if (commissionRate === 0) {
        break; // No commission for this level and beyond
      }

      let commissionAmount = 0;
      if (campaign.rewardType === RewardType.PERCENTAGE) {
        commissionAmount = (transaction.amount * commissionRate) / 100;
      } else if (campaign.rewardType === RewardType.FIXED) {
        commissionAmount = commissionRate;
      }
      // VOUCHER type doesn't create monetary commissions

      if (commissionAmount > 0) {
        const commission = CommissionEntity.create(
          affiliate.id,
          transaction.id,
          campaign.id,
          commissionAmount,
          level,
        );
        commissionsToCreate.push(commission);
      }
    }

    // 6. Bulk create commissions
    if (commissionsToCreate.length > 0) {
      return this.commissionRepository.bulkCreate(commissionsToCreate);
    }

    return [];
  }
}
