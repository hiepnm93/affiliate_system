import { ReferredUserEntity } from '../../../domains/affiliate/entities/referred-user.entity';
import { ReferredUserOrmEntity } from '../entities/referred-user.orm-entity';

export class ReferredUserMapper {
  static toDomain(ormEntity: ReferredUserOrmEntity): ReferredUserEntity {
    return new ReferredUserEntity(
      ormEntity.id,
      ormEntity.email,
      ormEntity.userId,
      ormEntity.referralCode,
      ormEntity.affiliateId,
      ormEntity.cookieId,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }

  static toOrm(domainEntity: ReferredUserEntity): ReferredUserOrmEntity {
    const ormEntity = new ReferredUserOrmEntity();
    if (domainEntity.id) {
      ormEntity.id = domainEntity.id;
    }
    ormEntity.email = domainEntity.email;
    ormEntity.userId = domainEntity.userId;
    ormEntity.referralCode = domainEntity.referralCode;
    ormEntity.affiliateId = domainEntity.affiliateId;
    ormEntity.cookieId = domainEntity.cookieId;
    if (domainEntity.createdAt) {
      ormEntity.createdAt = domainEntity.createdAt;
    }
    if (domainEntity.updatedAt) {
      ormEntity.updatedAt = domainEntity.updatedAt;
    }
    return ormEntity;
  }
}
