import { PayoutEntity } from '../../../domains/payout/entities/payout.entity';
import { PayoutOrmEntity } from '../entities/payout.orm-entity';

export class PayoutMapper {
  static toDomain(orm: PayoutOrmEntity): PayoutEntity {
    const entity = new PayoutEntity();
    entity.id = orm.id;
    entity.affiliateId = orm.affiliateId;
    entity.amount = Number(orm.amount);
    entity.paymentMethod = orm.paymentMethod;
    entity.status = orm.status;
    entity.requestedAt = orm.requestedAt;
    entity.processedAt = orm.processedAt;
    entity.adminNotes = orm.adminNotes;
    entity.paymentDetails = orm.paymentDetails;
    entity.failureReason = orm.failureReason;
    entity.createdAt = orm.createdAt;
    entity.updatedAt = orm.updatedAt;
    return entity;
  }

  static toOrm(entity: Partial<PayoutEntity>): Partial<PayoutOrmEntity> {
    const orm: Partial<PayoutOrmEntity> = {};
    if (entity.id !== undefined) orm.id = entity.id;
    if (entity.affiliateId !== undefined) orm.affiliateId = entity.affiliateId;
    if (entity.amount !== undefined) orm.amount = entity.amount;
    if (entity.paymentMethod !== undefined)
      orm.paymentMethod = entity.paymentMethod;
    if (entity.status !== undefined) orm.status = entity.status;
    if (entity.requestedAt !== undefined) orm.requestedAt = entity.requestedAt;
    if (entity.processedAt !== undefined) orm.processedAt = entity.processedAt;
    if (entity.adminNotes !== undefined) orm.adminNotes = entity.adminNotes;
    if (entity.paymentDetails !== undefined)
      orm.paymentDetails = entity.paymentDetails;
    if (entity.failureReason !== undefined)
      orm.failureReason = entity.failureReason;
    return orm;
  }
}
