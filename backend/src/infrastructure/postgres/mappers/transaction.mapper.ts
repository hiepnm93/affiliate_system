import { TransactionEntity } from '../../../domains/transaction/entities/transaction.entity';
import { TransactionOrmEntity } from '../entities/transaction.orm-entity';

export class TransactionMapper {
  static toDomain(ormEntity: TransactionOrmEntity): TransactionEntity {
    return new TransactionEntity(
      ormEntity.id,
      ormEntity.referredUserId,
      Number(ormEntity.amount),
      ormEntity.currency,
      ormEntity.status,
      ormEntity.externalId,
      ormEntity.metadata,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }

  static toOrm(domainEntity: TransactionEntity): TransactionOrmEntity {
    const ormEntity = new TransactionOrmEntity();
    if (domainEntity.id) {
      ormEntity.id = domainEntity.id;
    }
    ormEntity.referredUserId = domainEntity.referredUserId;
    ormEntity.amount = domainEntity.amount;
    ormEntity.currency = domainEntity.currency;
    ormEntity.status = domainEntity.status;
    ormEntity.externalId = domainEntity.externalId;
    ormEntity.metadata = domainEntity.metadata;
    if (domainEntity.createdAt) {
      ormEntity.createdAt = domainEntity.createdAt;
    }
    if (domainEntity.updatedAt) {
      ormEntity.updatedAt = domainEntity.updatedAt;
    }
    return ormEntity;
  }
}
