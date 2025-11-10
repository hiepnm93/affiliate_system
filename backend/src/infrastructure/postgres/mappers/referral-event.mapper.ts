import { ReferralEventEntity } from '../../../domains/affiliate/entities/referral-event.entity';
import { ReferralEventOrmEntity } from '../entities/referral-event.orm-entity';

export class ReferralEventMapper {
  static toDomain(ormEntity: ReferralEventOrmEntity): ReferralEventEntity {
    return new ReferralEventEntity(
      ormEntity.id,
      ormEntity.affiliateId,
      ormEntity.referredUserId,
      ormEntity.eventType,
      ormEntity.ipAddress,
      ormEntity.userAgent,
      ormEntity.cookieId,
      ormEntity.referrer,
      ormEntity.metadata,
      ormEntity.timestamp,
    );
  }

  static toOrm(domainEntity: ReferralEventEntity): ReferralEventOrmEntity {
    const ormEntity = new ReferralEventOrmEntity();
    if (domainEntity.id) {
      ormEntity.id = domainEntity.id;
    }
    ormEntity.affiliateId = domainEntity.affiliateId;
    ormEntity.referredUserId = domainEntity.referredUserId;
    ormEntity.eventType = domainEntity.eventType;
    ormEntity.ipAddress = domainEntity.ipAddress;
    ormEntity.userAgent = domainEntity.userAgent;
    ormEntity.cookieId = domainEntity.cookieId;
    ormEntity.referrer = domainEntity.referrer;
    ormEntity.metadata = domainEntity.metadata;
    if (domainEntity.timestamp) {
      ormEntity.timestamp = domainEntity.timestamp;
    }
    return ormEntity;
  }
}
