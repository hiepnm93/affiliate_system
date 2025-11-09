import { ReferralEventEntity, ReferralEventType } from '../entities/referral-event.entity';

export interface IReferralEventRepository {
  findById(id: number): Promise<ReferralEventEntity | null>;
  create(event: Omit<ReferralEventEntity, 'id' | 'timestamp'>): Promise<ReferralEventEntity>;
  findByAffiliateId(affiliateId: number, eventType?: ReferralEventType): Promise<ReferralEventEntity[]>;
  findByReferredUserId(referredUserId: number): Promise<ReferralEventEntity[]>;
  countByAffiliateId(affiliateId: number, eventType?: ReferralEventType): Promise<number>;
  findRecentEventsByIp(ipAddress: string, hours: number): Promise<ReferralEventEntity[]>;
}

export const REFERRAL_EVENT_REPOSITORY = Symbol('REFERRAL_EVENT_REPOSITORY');
