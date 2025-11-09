import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  IAffiliateRepository,
  AFFILIATE_REPOSITORY,
} from '../../domains/affiliate/repositories/affiliate.repository.interface';
import {
  IReferralEventRepository,
  REFERRAL_EVENT_REPOSITORY,
} from '../../domains/affiliate/repositories/referral-event.repository.interface';
import { ReferralEventEntity } from '../../domains/affiliate/entities/referral-event.entity';
import { TrackingService } from '../../infrastructure/redis/tracking.service';

export interface TrackClickDto {
  referralCode: string;
  ipAddress: string;
  userAgent: string;
  referrer?: string;
}

export interface TrackClickResponse {
  cookieId: string;
  affiliateId: number;
}

@Injectable()
export class TrackClickUseCase {
  constructor(
    @Inject(AFFILIATE_REPOSITORY)
    private readonly affiliateRepository: IAffiliateRepository,
    @Inject(REFERRAL_EVENT_REPOSITORY)
    private readonly eventRepository: IReferralEventRepository,
    private readonly trackingService: TrackingService,
  ) {}

  async execute(dto: TrackClickDto): Promise<TrackClickResponse> {
    // Find affiliate by referral code
    const affiliate = await this.affiliateRepository.findByReferralCode(
      dto.referralCode,
    );
    if (!affiliate) {
      throw new NotFoundException('Referral code not found');
    }

    // Generate cookie ID
    const cookieId = this.trackingService.generateCookieId();

    // Set tracking cookie in Redis
    await this.trackingService.setTrackingCookie(cookieId, {
      affiliateId: affiliate.id,
      referralCode: dto.referralCode,
      timestamp: new Date(),
    });

    // Create click event
    const event = ReferralEventEntity.createClickEvent(
      affiliate.id,
      dto.ipAddress,
      dto.userAgent,
      dto.referrer || null,
      cookieId,
    );

    await this.eventRepository.create(event);

    return {
      cookieId,
      affiliateId: affiliate.id,
    };
  }
}
