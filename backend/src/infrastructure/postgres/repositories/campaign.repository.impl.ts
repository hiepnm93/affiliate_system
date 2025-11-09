import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { ICampaignRepository } from '../../../domains/campaign/repositories/campaign.repository.interface';
import {
  CampaignEntity,
  CampaignStatus,
} from '../../../domains/campaign/entities/campaign.entity';
import { CampaignOrmEntity } from '../entities/campaign.orm-entity';
import { CampaignMapper } from '../mappers/campaign.mapper';

@Injectable()
export class CampaignRepositoryImpl implements ICampaignRepository {
  constructor(
    @InjectRepository(CampaignOrmEntity)
    private readonly repository: Repository<CampaignOrmEntity>,
  ) {}

  async findById(id: number): Promise<CampaignEntity | null> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? CampaignMapper.toDomain(ormEntity) : null;
  }

  async findAll(): Promise<CampaignEntity[]> {
    const ormEntities = await this.repository.find({
      order: { createdAt: 'DESC' },
    });
    return ormEntities.map((entity) => CampaignMapper.toDomain(entity));
  }

  async findActiveCampaign(date?: Date): Promise<CampaignEntity | null> {
    const now = date || new Date();

    const ormEntity = await this.repository.findOne({
      where: {
        status: CampaignStatus.ACTIVE,
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
      },
      order: { createdAt: 'DESC' },
    });

    return ormEntity ? CampaignMapper.toDomain(ormEntity) : null;
  }

  async create(
    campaign: Omit<CampaignEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<CampaignEntity> {
    const ormEntity = this.repository.create(campaign as any);
    const savedEntity = (await this.repository.save(ormEntity)) as any;
    return CampaignMapper.toDomain(savedEntity);
  }

  async update(
    id: number,
    campaign: Partial<CampaignEntity>,
  ): Promise<CampaignEntity | null> {
    await this.repository.update(id, campaign as any);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
