import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICommissionRepository } from '../../../domains/commission/repositories/commission.repository.interface';
import {
  CommissionEntity,
  CommissionStatus,
} from '../../../domains/commission/entities/commission.entity';
import { CommissionOrmEntity } from '../entities/commission.orm-entity';
import { CommissionMapper } from '../mappers/commission.mapper';

@Injectable()
export class CommissionRepositoryImpl implements ICommissionRepository {
  constructor(
    @InjectRepository(CommissionOrmEntity)
    private readonly repository: Repository<CommissionOrmEntity>,
  ) {}

  async findById(id: number): Promise<CommissionEntity | null> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? CommissionMapper.toDomain(ormEntity) : null;
  }

  async findByAffiliateId(
    affiliateId: number,
    status?: CommissionStatus,
  ): Promise<CommissionEntity[]> {
    const where: any = { affiliateId };
    if (status) {
      where.status = status;
    }

    const ormEntities = await this.repository.find({
      where,
      order: { createdAt: 'DESC' },
    });
    return ormEntities.map((entity) => CommissionMapper.toDomain(entity));
  }

  async findByTransactionId(transactionId: number): Promise<CommissionEntity[]> {
    const ormEntities = await this.repository.find({
      where: { transactionId },
      order: { level: 'ASC' },
    });
    return ormEntities.map((entity) => CommissionMapper.toDomain(entity));
  }

  async findPendingCommissions(): Promise<CommissionEntity[]> {
    const ormEntities = await this.repository.find({
      where: { status: CommissionStatus.PENDING },
      order: { createdAt: 'ASC' },
    });
    return ormEntities.map((entity) => CommissionMapper.toDomain(entity));
  }

  async getTotalEarnings(
    affiliateId: number,
    status?: CommissionStatus,
  ): Promise<number> {
    const query = this.repository
      .createQueryBuilder('commission')
      .select('SUM(commission.amount)', 'total')
      .where('commission.affiliateId = :affiliateId', { affiliateId });

    if (status) {
      query.andWhere('commission.status = :status', { status });
    }

    const result = await query.getRawOne();
    return Number(result?.total || 0);
  }

  async create(
    commission: Omit<CommissionEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<CommissionEntity> {
    const ormEntity = this.repository.create(commission as any);
    const savedEntity = await this.repository.save(ormEntity);
    return CommissionMapper.toDomain(savedEntity);
  }

  async update(
    id: number,
    commission: Partial<CommissionEntity>,
  ): Promise<CommissionEntity | null> {
    await this.repository.update(id, commission as any);
    return this.findById(id);
  }

  async bulkCreate(
    commissions: Omit<CommissionEntity, 'id' | 'createdAt' | 'updatedAt'>[],
  ): Promise<CommissionEntity[]> {
    const ormEntities = this.repository.create(commissions as any);
    const savedEntities = await this.repository.save(ormEntities);
    return savedEntities.map((entity) => CommissionMapper.toDomain(entity));
  }
}
