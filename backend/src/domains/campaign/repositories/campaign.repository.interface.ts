import { CampaignEntity } from '../entities/campaign.entity';

export interface ICampaignRepository {
  findById(id: number): Promise<CampaignEntity | null>;
  findAll(): Promise<CampaignEntity[]>;
  findActiveCampaign(date?: Date): Promise<CampaignEntity | null>;
  create(
    campaign: Omit<CampaignEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<CampaignEntity>;
  update(
    id: number,
    campaign: Partial<CampaignEntity>,
  ): Promise<CampaignEntity | null>;
  delete(id: number): Promise<boolean>;
}

export const CAMPAIGN_REPOSITORY = Symbol('CAMPAIGN_REPOSITORY');
