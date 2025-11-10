import apiClient from '../apiClient';
import type {
  Commission,
  CommissionStatus,
  ApproveCommissionDto,
  RejectCommissionDto,
} from '@/types/affiliate';

export enum CommissionApi {
  GetMyCommissions = '/affiliate/commissions',
  GetAllCommissions = '/admin/commissions',
  GetPendingCommissions = '/admin/commissions/pending',
  ApproveCommission = '/admin/commissions/:id/approve',
  RejectCommission = '/admin/commissions/:id/reject',
}

// Affiliate endpoints
const getMyCommissions = (status?: CommissionStatus) =>
  apiClient.get<Commission[]>({
    url: CommissionApi.GetMyCommissions,
    params: { status },
  });

// Admin endpoints
const getAllCommissions = (status?: CommissionStatus, affiliateId?: number) =>
  apiClient.get<Commission[]>({
    url: CommissionApi.GetAllCommissions,
    params: { status, affiliateId },
  });

const getPendingCommissions = () =>
  apiClient.get<Commission[]>({ url: CommissionApi.GetPendingCommissions });

const approveCommission = (id: number, data?: ApproveCommissionDto) =>
  apiClient.put<Commission>({
    url: CommissionApi.ApproveCommission.replace(':id', String(id)),
    data,
  });

const rejectCommission = (id: number, data: RejectCommissionDto) =>
  apiClient.put<Commission>({
    url: CommissionApi.RejectCommission.replace(':id', String(id)),
    data,
  });

export default {
  getMyCommissions,
  getAllCommissions,
  getPendingCommissions,
  approveCommission,
  rejectCommission,
};
