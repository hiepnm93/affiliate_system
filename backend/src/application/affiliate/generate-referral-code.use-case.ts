import { Injectable, Inject, ConflictException } from '@nestjs/common';
import {
  IAffiliateRepository,
  AFFILIATE_REPOSITORY,
} from '../../domains/affiliate/repositories/affiliate.repository.interface';
import { AffiliateEntity } from '../../domains/affiliate/entities/affiliate.entity';

@Injectable()
export class GenerateReferralCodeUseCase {
  constructor(
    @Inject(AFFILIATE_REPOSITORY)
    private readonly affiliateRepository: IAffiliateRepository,
  ) {}

  async execute(
    userId: number,
    parentReferralCode?: string,
  ): Promise<AffiliateEntity> {
    // Check if user already has an affiliate account
    const existingAffiliate =
      await this.affiliateRepository.findByUserId(userId);
    if (existingAffiliate) {
      return existingAffiliate;
    }

    // Find parent affiliate if code provided
    let parentAffiliateId: number | null = null;
    let tier = 1;

    if (parentReferralCode) {
      const parentAffiliate =
        await this.affiliateRepository.findByReferralCode(parentReferralCode);
      if (parentAffiliate) {
        parentAffiliateId = parentAffiliate.id;
        tier = parentAffiliate.tier + 1;
      }
    }

    // Generate unique referral code
    let referralCode: string;
    let attempts = 0;
    const maxAttempts = 5;

    do {
      referralCode = this.generateCode();
      const existing =
        await this.affiliateRepository.findByReferralCode(referralCode);
      if (!existing) break;

      attempts++;
      if (attempts >= maxAttempts) {
        throw new ConflictException('Failed to generate unique referral code');
      }
    } while (attempts < maxAttempts);

    // Create affiliate
    const affiliate = AffiliateEntity.create(
      userId,
      referralCode,
      parentAffiliateId,
    );

    return this.affiliateRepository.create({
      ...affiliate,
      tier,
    } as any);
  }

  private generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
