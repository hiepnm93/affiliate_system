import { CommissionEntity } from '../../../domains/commission/entities/commission.entity';
import { CommissionOrmEntity } from '../entities/commission.orm-entity';

export class CommissionMapper {
  static toDomain(ormEntity: CommissionOrmEntity): CommissionEntity {
    return new CommissionEntity(
      ormEntity.id,
      ormEntity.affiliateId,
      ormEntity.transactionId,
      ormEntity.campaignId,
      Number(ormEntity.amount),
      ormEntity.level,
      ormEntity.status,
      ormEntity.notes,
      ormEntity.payoutId,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }

  static toOrm(domainEntity: CommissionEntity): CommissionOrmEntity {
    const ormEntity = new CommissionOrmEntity();
    if (domainEntity.id) {
      ormEntity.id = domainEntity.id;
    }
    ormEntity.affiliateId = domainEntity.affiliateId;
    ormEntity.transactionId = domainEntity.transactionId;
    ormEntity.campaignId = domainEntity.campaignId;
    ormEntity.amount = domainEntity.amount;
    ormEntity.level = domainEntity.level;
    ormEntity.status = domainEntity.status;
    ormEntity.notes = domainEntity.notes;
    ormEntity.payoutId = domainEntity.payoutId;
    if (domainEntity.createdAt) {
      ormEntity.createdAt = domainEntity.createdAt;
    }
    if (domainEntity.updatedAt) {
      ormEntity.updatedAt = domainEntity.updatedAt;
    }
    return ormEntity;
  }
}
