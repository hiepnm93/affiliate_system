import { Injectable, Inject } from '@nestjs/common';
import {
  ICampaignRepository,
  CAMPAIGN_REPOSITORY,
} from '../../domains/campaign/repositories/campaign.repository.interface';
import {
  CampaignEntity,
  RewardType,
  MultiLevelConfig,
} from '../../domains/campaign/entities/campaign.entity';

export interface CreateCampaignDto {
  name: string;
  startDate: Date;
  endDate: Date;
  rewardType: RewardType;
  rewardValue: number;
  multiLevelConfig: MultiLevelConfig;
  cookieTTL?: number;
}

@Injectable()
export class CreateCampaignUseCase {
  constructor(
    @Inject(CAMPAIGN_REPOSITORY)
    private readonly campaignRepository: ICampaignRepository,
  ) {}

  async execute(dto: CreateCampaignDto): Promise<CampaignEntity> {
    const campaign = CampaignEntity.create(
      dto.name,
      dto.startDate,
      dto.endDate,
      dto.rewardType,
      dto.rewardValue,
      dto.multiLevelConfig,
      dto.cookieTTL,
    );

    return this.campaignRepository.create(campaign);
  }
}
