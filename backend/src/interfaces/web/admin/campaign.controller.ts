import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '../../../infrastructure/auth/roles.guard';
import { Roles } from '../../../infrastructure/auth/roles.decorator';
import { UserRole } from '../../../domains/user/entities/user.entity';
import {
  CreateCampaignUseCase,
  CreateCampaignDto,
} from '../../../application/campaign/create-campaign.use-case';
import { GetActiveCampaignUseCase } from '../../../application/campaign/get-active-campaign.use-case';

@Controller('admin/campaigns')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class CampaignController {
  constructor(
    private readonly createCampaignUseCase: CreateCampaignUseCase,
    private readonly getActiveCampaignUseCase: GetActiveCampaignUseCase,
  ) {}

  @Post()
  async createCampaign(@Body() dto: CreateCampaignDto) {
    const campaign = await this.createCampaignUseCase.execute(dto);
    return {
      id: campaign.id,
      name: campaign.name,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      rewardType: campaign.rewardType,
      rewardValue: campaign.rewardValue,
      multiLevelConfig: campaign.multiLevelConfig,
      cookieTTL: campaign.cookieTTL,
      status: campaign.status,
    };
  }

  @Get('active')
  async getActiveCampaign() {
    const campaign = await this.getActiveCampaignUseCase.execute();
    if (!campaign) {
      return null;
    }

    return {
      id: campaign.id,
      name: campaign.name,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      rewardType: campaign.rewardType,
      rewardValue: campaign.rewardValue,
      multiLevelConfig: campaign.multiLevelConfig,
      cookieTTL: campaign.cookieTTL,
      status: campaign.status,
    };
  }
}
