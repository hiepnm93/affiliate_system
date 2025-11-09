import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAffiliateRepository } from '../../../domains/affiliate/repositories/affiliate.repository.interface';
import { AffiliateEntity } from '../../../domains/affiliate/entities/affiliate.entity';
import { AffiliateOrmEntity } from '../entities/affiliate.orm-entity';
import { AffiliateMapper } from '../mappers/affiliate.mapper';

@Injectable()
export class AffiliateRepositoryImpl implements IAffiliateRepository {
  constructor(
    @InjectRepository(AffiliateOrmEntity)
    private readonly repository: Repository<AffiliateOrmEntity>,
  ) {}

  async findById(id: number): Promise<AffiliateEntity | null> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? AffiliateMapper.toDomain(ormEntity) : null;
  }

  async findByUserId(userId: number): Promise<AffiliateEntity | null> {
    const ormEntity = await this.repository.findOne({ where: { userId } });
    return ormEntity ? AffiliateMapper.toDomain(ormEntity) : null;
  }

  async findByReferralCode(code: string): Promise<AffiliateEntity | null> {
    const ormEntity = await this.repository.findOne({
      where: { referralCode: code },
    });
    return ormEntity ? AffiliateMapper.toDomain(ormEntity) : null;
  }

  async create(
    affiliate: Omit<AffiliateEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AffiliateEntity> {
    const ormEntity = this.repository.create(affiliate as any);
    const savedEntity = (await this.repository.save(
      ormEntity,
    )) as unknown as AffiliateOrmEntity;
    return AffiliateMapper.toDomain(savedEntity);
  }

  async update(
    id: number,
    affiliate: Partial<AffiliateEntity>,
  ): Promise<AffiliateEntity | null> {
    await this.repository.update(id, AffiliateMapper.toOrmPartial(affiliate));
    return this.findById(id);
  }

  async findChildren(parentId: number): Promise<AffiliateEntity[]> {
    const ormEntities = await this.repository.find({
      where: { parentAffiliateId: parentId },
    });
    return ormEntities.map((entity) => AffiliateMapper.toDomain(entity));
  }

  async findParentChain(affiliateId: number): Promise<AffiliateEntity[]> {
    const chain: AffiliateEntity[] = [];
    let currentId: number | null = affiliateId;

    while (currentId !== null) {
      const affiliate = await this.findById(currentId);
      if (!affiliate) break;

      chain.push(affiliate);
      currentId = affiliate.parentAffiliateId;

      // Prevent infinite loop
      if (chain.length > 10) break;
    }

    return chain;
  }
}
