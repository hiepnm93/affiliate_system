import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { IReferralEventRepository } from '../../../domains/affiliate/repositories/referral-event.repository.interface';
import {
  ReferralEventEntity,
  ReferralEventType,
} from '../../../domains/affiliate/entities/referral-event.entity';
import { ReferralEventOrmEntity } from '../entities/referral-event.orm-entity';
import { ReferralEventMapper } from '../mappers/referral-event.mapper';

@Injectable()
export class ReferralEventRepositoryImpl implements IReferralEventRepository {
  constructor(
    @InjectRepository(ReferralEventOrmEntity)
    private readonly repository: Repository<ReferralEventOrmEntity>,
  ) {}

  async findById(id: number): Promise<ReferralEventEntity | null> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? ReferralEventMapper.toDomain(ormEntity) : null;
  }

  async create(
    event: Omit<ReferralEventEntity, 'id' | 'timestamp'>,
  ): Promise<ReferralEventEntity> {
    const ormEntity = this.repository.create(event as any);
    const savedEntity = await this.repository.save(ormEntity);
    return ReferralEventMapper.toDomain(savedEntity);
  }

  async findByAffiliateId(
    affiliateId: number,
    eventType?: ReferralEventType,
  ): Promise<ReferralEventEntity[]> {
    const where: any = { affiliateId };
    if (eventType) {
      where.eventType = eventType;
    }

    const ormEntities = await this.repository.find({
      where,
      order: { timestamp: 'DESC' },
    });
    return ormEntities.map((entity) => ReferralEventMapper.toDomain(entity));
  }

  async findByReferredUserId(
    referredUserId: number,
  ): Promise<ReferralEventEntity[]> {
    const ormEntities = await this.repository.find({
      where: { referredUserId },
      order: { timestamp: 'DESC' },
    });
    return ormEntities.map((entity) => ReferralEventMapper.toDomain(entity));
  }

  async countByAffiliateId(
    affiliateId: number,
    eventType?: ReferralEventType,
  ): Promise<number> {
    const where: any = { affiliateId };
    if (eventType) {
      where.eventType = eventType;
    }

    return this.repository.count({ where });
  }

  async findRecentEventsByIp(
    ipAddress: string,
    hours: number,
  ): Promise<ReferralEventEntity[]> {
    const since = new Date();
    since.setHours(since.getHours() - hours);

    const ormEntities = await this.repository.find({
      where: {
        ipAddress,
        timestamp: MoreThanOrEqual(since),
      },
      order: { timestamp: 'DESC' },
    });
    return ormEntities.map((entity) => ReferralEventMapper.toDomain(entity));
  }
}
