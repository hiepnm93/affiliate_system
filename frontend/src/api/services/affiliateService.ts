import apiClient from '../apiClient';
import type {
  Affiliate,
  AffiliateStats,
  AffiliateHierarchy,
  RegisterAsAffiliateDto,
} from '@/types/affiliate';

export enum AffiliateApi {
  GetMyAffiliate = '/affiliate/me',
  GetReferralCode = '/affiliate/me/code',
  GetStats = '/affiliate/stats',
  GetHierarchy = '/affiliate/hierarchy',
  RegisterAsAffiliate = '/auth/register/affiliate',
  GetReferrals = '/affiliate/referrals',
}

const getMyAffiliate = () => apiClient.get<Affiliate>({ url: AffiliateApi.GetMyAffiliate });

const getReferralCode = () =>
  apiClient.get<{ referralCode: string; shareableLink: string }>({
    url: AffiliateApi.GetReferralCode,
  });

const getStats = (startDate?: string, endDate?: string) =>
  apiClient.get<AffiliateStats>({
    url: AffiliateApi.GetStats,
    params: { startDate, endDate },
  });

const getHierarchy = () =>
  apiClient.get<AffiliateHierarchy>({ url: AffiliateApi.GetHierarchy });

const getReferrals = () =>
  apiClient.get<any[]>({ url: AffiliateApi.GetReferrals });

const registerAsAffiliate = (data: RegisterAsAffiliateDto) =>
  apiClient.post<{ affiliate: Affiliate; token: string }>({
    url: AffiliateApi.RegisterAsAffiliate,
    data,
  });

export default {
  getMyAffiliate,
  getReferralCode,
  getStats,
  getHierarchy,
  getReferrals,
  registerAsAffiliate,
};
