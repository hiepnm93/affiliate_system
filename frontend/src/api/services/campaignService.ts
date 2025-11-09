import apiClient from '../apiClient';
import type { Campaign, CreateCampaignDto, UpdateCampaignDto } from '@/types/affiliate';

export enum CampaignApi {
  GetAllCampaigns = '/admin/campaigns',
  GetCampaign = '/admin/campaigns/:id',
  CreateCampaign = '/admin/campaigns',
  UpdateCampaign = '/admin/campaigns/:id',
  DeleteCampaign = '/admin/campaigns/:id',
  GetActiveCampaign = '/campaigns/active',
}

const getAllCampaigns = () =>
  apiClient.get<Campaign[]>({ url: CampaignApi.GetAllCampaigns });

const getCampaign = (id: number) =>
  apiClient.get<Campaign>({ url: CampaignApi.GetCampaign.replace(':id', String(id)) });

const createCampaign = (data: CreateCampaignDto) =>
  apiClient.post<Campaign>({ url: CampaignApi.CreateCampaign, data });

const updateCampaign = (id: number, data: UpdateCampaignDto) =>
  apiClient.put<Campaign>({
    url: CampaignApi.UpdateCampaign.replace(':id', String(id)),
    data,
  });

const deleteCampaign = (id: number) =>
  apiClient.delete<void>({ url: CampaignApi.DeleteCampaign.replace(':id', String(id)) });

const getActiveCampaign = () =>
  apiClient.get<Campaign>({ url: CampaignApi.GetActiveCampaign });

export default {
  getAllCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getActiveCampaign,
};
