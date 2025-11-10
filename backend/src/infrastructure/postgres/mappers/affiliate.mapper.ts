import { AffiliateEntity } from '../../../domains/affiliate/entities/affiliate.entity';
import { AffiliateOrmEntity } from '../entities/affiliate.orm-entity';

export class AffiliateMapper {
  static toDomain(ormEntity: AffiliateOrmEntity): AffiliateEntity {
    return new AffiliateEntity(
      ormEntity.id,
      ormEntity.userId,
      ormEntity.referralCode,
      ormEntity.parentAffiliateId,
      ormEntity.tier,
      ormEntity.status,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }

  static toOrm(domainEntity: AffiliateEntity): AffiliateOrmEntity {
    const ormEntity = new AffiliateOrmEntity();
    if (domainEntity.id) {
      ormEntity.id = domainEntity.id;
    }
    ormEntity.userId = domainEntity.userId;
    ormEntity.referralCode = domainEntity.referralCode;
    ormEntity.parentAffiliateId = domainEntity.parentAffiliateId;
    ormEntity.tier = domainEntity.tier;
    ormEntity.status = domainEntity.status;
    if (domainEntity.createdAt) {
      ormEntity.createdAt = domainEntity.createdAt;
    }
    if (domainEntity.updatedAt) {
      ormEntity.updatedAt = domainEntity.updatedAt;
    }
    return ormEntity;
  }

  static toOrmPartial(
    domainEntity: Partial<AffiliateEntity>,
  ): Partial<AffiliateOrmEntity> {
    const ormEntity: Partial<AffiliateOrmEntity> = {};
    if (domainEntity.id !== undefined) ormEntity.id = domainEntity.id;
    if (domainEntity.userId !== undefined)
      ormEntity.userId = domainEntity.userId;
    if (domainEntity.referralCode !== undefined)
      ormEntity.referralCode = domainEntity.referralCode;
    if (domainEntity.parentAffiliateId !== undefined)
      ormEntity.parentAffiliateId = domainEntity.parentAffiliateId;
    if (domainEntity.tier !== undefined) ormEntity.tier = domainEntity.tier;
    if (domainEntity.status !== undefined)
      ormEntity.status = domainEntity.status;
    if (domainEntity.createdAt !== undefined)
      ormEntity.createdAt = domainEntity.createdAt;
    if (domainEntity.updatedAt !== undefined)
      ormEntity.updatedAt = domainEntity.updatedAt;
    return ormEntity;
  }
}
