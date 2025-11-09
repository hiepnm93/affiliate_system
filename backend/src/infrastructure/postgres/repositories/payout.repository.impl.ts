import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPayoutRepository } from '../../../domains/payout/repositories/payout.repository.interface';
import {
  PayoutEntity,
  PayoutStatus,
} from '../../../domains/payout/entities/payout.entity';
import { PayoutOrmEntity } from '../entities/payout.orm-entity';
import { PayoutMapper } from '../mappers/payout.mapper';

@Injectable()
export class PayoutRepositoryImpl implements IPayoutRepository {
  constructor(
    @InjectRepository(PayoutOrmEntity)
    private readonly repository: Repository<PayoutOrmEntity>,
  ) {}

  async create(
    payout: Omit<PayoutEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<PayoutEntity> {
    const ormEntity = this.repository.create(payout as any);
    const savedEntity = (await this.repository.save(
      ormEntity,
    )) as unknown as PayoutOrmEntity;
    return PayoutMapper.toDomain(savedEntity);
  }

  async findById(id: number): Promise<PayoutEntity | null> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? PayoutMapper.toDomain(ormEntity) : null;
  }

  async findByAffiliateId(affiliateId: number): Promise<PayoutEntity[]> {
    const ormEntities = await this.repository.find({
      where: { affiliateId },
      order: { requestedAt: 'DESC' },
    });
    return ormEntities.map((orm) => PayoutMapper.toDomain(orm));
  }

  async findByStatus(status: PayoutStatus): Promise<PayoutEntity[]> {
    const ormEntities = await this.repository.find({
      where: { status },
      order: { requestedAt: 'DESC' },
    });
    return ormEntities.map((orm) => PayoutMapper.toDomain(orm));
  }

  async findAll(filters?: {
    status?: PayoutStatus;
    affiliateId?: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<PayoutEntity[]> {
    const query = this.repository.createQueryBuilder('payout');

    if (filters?.status) {
      query.andWhere('payout.status = :status', { status: filters.status });
    }

    if (filters?.affiliateId) {
      query.andWhere('payout.affiliateId = :affiliateId', {
        affiliateId: filters.affiliateId,
      });
    }

    if (filters?.startDate) {
      query.andWhere('payout.requestedAt >= :startDate', {
        startDate: filters.startDate,
      });
    }

    if (filters?.endDate) {
      query.andWhere('payout.requestedAt <= :endDate', {
        endDate: filters.endDate,
      });
    }

    query.orderBy('payout.requestedAt', 'DESC');

    const ormEntities = await query.getMany();
    return ormEntities.map((orm) => PayoutMapper.toDomain(orm));
  }

  async update(
    id: number,
    data: Partial<PayoutEntity>,
  ): Promise<PayoutEntity | null> {
    const ormData = PayoutMapper.toOrm(data);
    await this.repository.update(id, ormData);
    return this.findById(id);
  }

  async getTotalPaidAmount(affiliateId: number): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('payout')
      .select('SUM(payout.amount)', 'total')
      .where('payout.affiliateId = :affiliateId', { affiliateId })
      .andWhere('payout.status = :status', { status: PayoutStatus.PAID })
      .getRawOne();

    return result?.total ? Number(result.total) : 0;
  }
}
