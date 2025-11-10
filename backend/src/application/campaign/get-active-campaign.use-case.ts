import { Injectable, Inject } from '@nestjs/common';
import {
  ICampaignRepository,
  CAMPAIGN_REPOSITORY,
} from '../../domains/campaign/repositories/campaign.repository.interface';
import { CampaignEntity } from '../../domains/campaign/entities/campaign.entity';

@Injectable()
export class GetActiveCampaignUseCase {
  constructor(
    @Inject(CAMPAIGN_REPOSITORY)
    private readonly campaignRepository: ICampaignRepository,
  ) {}

  async execute(date?: Date): Promise<CampaignEntity | null> {
    return this.campaignRepository.findActiveCampaign(date);
  }
}
