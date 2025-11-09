import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IReferredUserRepository } from '../../../domains/affiliate/repositories/referred-user.repository.interface';
import { ReferredUserEntity } from '../../../domains/affiliate/entities/referred-user.entity';
import { ReferredUserOrmEntity } from '../entities/referred-user.orm-entity';
import { ReferredUserMapper } from '../mappers/referred-user.mapper';

@Injectable()
export class ReferredUserRepositoryImpl implements IReferredUserRepository {
  constructor(
    @InjectRepository(ReferredUserOrmEntity)
    private readonly repository: Repository<ReferredUserOrmEntity>,
  ) {}

  async findById(id: number): Promise<ReferredUserEntity | null> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? ReferredUserMapper.toDomain(ormEntity) : null;
  }

  async findByEmail(email: string): Promise<ReferredUserEntity | null> {
    const ormEntity = await this.repository.findOne({ where: { email } });
    return ormEntity ? ReferredUserMapper.toDomain(ormEntity) : null;
  }

  async findByUserId(userId: number): Promise<ReferredUserEntity | null> {
    const ormEntity = await this.repository.findOne({ where: { userId } });
    return ormEntity ? ReferredUserMapper.toDomain(ormEntity) : null;
  }

  async findByCookieId(cookieId: string): Promise<ReferredUserEntity | null> {
    const ormEntity = await this.repository.findOne({ where: { cookieId } });
    return ormEntity ? ReferredUserMapper.toDomain(ormEntity) : null;
  }

  async create(
    referredUser: Omit<ReferredUserEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ReferredUserEntity> {
    const ormEntity = this.repository.create(referredUser as any);
    const savedEntity = await this.repository.save(ormEntity);
    return ReferredUserMapper.toDomain(savedEntity);
  }

  async update(
    id: number,
    referredUser: Partial<ReferredUserEntity>,
  ): Promise<ReferredUserEntity | null> {
    await this.repository.update(id, referredUser as any);
    return this.findById(id);
  }

  async findByAffiliateId(affiliateId: number): Promise<ReferredUserEntity[]> {
    const ormEntities = await this.repository.find({
      where: { affiliateId },
    });
    return ormEntities.map((entity) => ReferredUserMapper.toDomain(entity));
  }
}
