import { Injectable, Inject } from '@nestjs/common';
import {
  IAffiliateRepository,
  AFFILIATE_REPOSITORY,
} from '../../domains/affiliate/repositories/affiliate.repository.interface';
import {
  IReferredUserRepository,
  REFERRED_USER_REPOSITORY,
} from '../../domains/affiliate/repositories/referred-user.repository.interface';
import {
  IReferralEventRepository,
  REFERRAL_EVENT_REPOSITORY,
} from '../../domains/affiliate/repositories/referral-event.repository.interface';
import { ReferredUserEntity } from '../../domains/affiliate/entities/referred-user.entity';
import { ReferralEventEntity } from '../../domains/affiliate/entities/referral-event.entity';
import { TrackingService } from '../../infrastructure/redis/tracking.service';

export interface TrackSignupDto {
  userId: number;
  email: string;
  cookieId?: string;
  referralCode?: string;
  ipAddress: string;
  userAgent: string;
}

@Injectable()
export class TrackSignupUseCase {
  constructor(
    @Inject(AFFILIATE_REPOSITORY)
    private readonly affiliateRepository: IAffiliateRepository,
    @Inject(REFERRED_USER_REPOSITORY)
    private readonly referredUserRepository: IReferredUserRepository,
    @Inject(REFERRAL_EVENT_REPOSITORY)
    private readonly eventRepository: IReferralEventRepository,
    private readonly trackingService: TrackingService,
  ) {}

  async execute(dto: TrackSignupDto): Promise<ReferredUserEntity | null> {
    let affiliateId: number | null = null;
    let referralCode: string | null = null;
    let cookieId = dto.cookieId;

    // Try to get affiliate from cookie first
    if (cookieId) {
      const trackingData =
        await this.trackingService.getTrackingCookie(cookieId);
      if (trackingData) {
        affiliateId = trackingData.affiliateId;
        referralCode = trackingData.referralCode;
      }
    }

    // Fallback to referral code from URL
    if (!affiliateId && dto.referralCode) {
      const affiliate = await this.affiliateRepository.findByReferralCode(
        dto.referralCode,
      );
      if (affiliate) {
        affiliateId = affiliate.id;
        referralCode = dto.referralCode;
      }
    }

    // No referral found
    if (!affiliateId || !referralCode) {
      return null;
    }

    // Create referred user
    const referredUser = ReferredUserEntity.create(
      dto.email,
      referralCode,
      affiliateId,
      cookieId || null,
      dto.userId,
    );

    const savedReferredUser =
      await this.referredUserRepository.create(referredUser);

    // Create signup event
    const event = ReferralEventEntity.createSignupEvent(
      affiliateId,
      savedReferredUser.id,
      dto.ipAddress,
      dto.userAgent,
      cookieId || null,
    );

    await this.eventRepository.create(event);

    // Clean up tracking cookie
    if (cookieId) {
      await this.trackingService.deleteTrackingCookie(cookieId);
    }

    return savedReferredUser;
  }
}
