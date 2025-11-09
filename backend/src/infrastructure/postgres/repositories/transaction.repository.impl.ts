import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITransactionRepository } from '../../../domains/transaction/repositories/transaction.repository.interface';
import { TransactionEntity } from '../../../domains/transaction/entities/transaction.entity';
import { TransactionOrmEntity } from '../entities/transaction.orm-entity';
import { TransactionMapper } from '../mappers/transaction.mapper';

@Injectable()
export class TransactionRepositoryImpl implements ITransactionRepository {
  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly repository: Repository<TransactionOrmEntity>,
  ) {}

  async findById(id: number): Promise<TransactionEntity | null> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? TransactionMapper.toDomain(ormEntity) : null;
  }

  async findByExternalId(externalId: string): Promise<TransactionEntity | null> {
    const ormEntity = await this.repository.findOne({ where: { externalId } });
    return ormEntity ? TransactionMapper.toDomain(ormEntity) : null;
  }

  async findByReferredUserId(
    referredUserId: number,
  ): Promise<TransactionEntity[]> {
    const ormEntities = await this.repository.find({
      where: { referredUserId },
      order: { createdAt: 'DESC' },
    });
    return ormEntities.map((entity) => TransactionMapper.toDomain(entity));
  }

  async create(
    transaction: Omit<TransactionEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<TransactionEntity> {
    const ormEntity = this.repository.create(transaction as any);
    const savedEntity = await this.repository.save(ormEntity);
    return TransactionMapper.toDomain(savedEntity);
  }

  async update(
    id: number,
    transaction: Partial<TransactionEntity>,
  ): Promise<TransactionEntity | null> {
    await this.repository.update(id, transaction as any);
    return this.findById(id);
  }
}
