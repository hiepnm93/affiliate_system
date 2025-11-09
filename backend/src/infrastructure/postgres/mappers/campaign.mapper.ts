import { CampaignEntity } from '../../../domains/campaign/entities/campaign.entity';
import { CampaignOrmEntity } from '../entities/campaign.orm-entity';

export class CampaignMapper {
  static toDomain(ormEntity: CampaignOrmEntity): CampaignEntity {
    return new CampaignEntity(
      ormEntity.id,
      ormEntity.name,
      ormEntity.startDate,
      ormEntity.endDate,
      ormEntity.rewardType,
      Number(ormEntity.rewardValue),
      ormEntity.multiLevelConfig,
      ormEntity.cookieTTL,
      ormEntity.status,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }

  static toOrm(domainEntity: CampaignEntity): CampaignOrmEntity {
    const ormEntity = new CampaignOrmEntity();
    if (domainEntity.id) {
      ormEntity.id = domainEntity.id;
    }
    ormEntity.name = domainEntity.name;
    ormEntity.startDate = domainEntity.startDate;
    ormEntity.endDate = domainEntity.endDate;
    ormEntity.rewardType = domainEntity.rewardType;
    ormEntity.rewardValue = domainEntity.rewardValue;
    ormEntity.multiLevelConfig = domainEntity.multiLevelConfig;
    ormEntity.cookieTTL = domainEntity.cookieTTL;
    ormEntity.status = domainEntity.status;
    if (domainEntity.createdAt) {
      ormEntity.createdAt = domainEntity.createdAt;
    }
    if (domainEntity.updatedAt) {
      ormEntity.updatedAt = domainEntity.updatedAt;
    }
    return ormEntity;
  }
}
