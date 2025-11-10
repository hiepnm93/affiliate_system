import apiClient from '../apiClient';
import type {
  Payout,
  PayoutStatus,
  RequestPayoutDto,
  ProcessPayoutDto,
} from '@/types/affiliate';

export enum PayoutApi {
  RequestPayout = '/affiliate/payouts',
  GetMyPayouts = '/affiliate/payouts',
  GetAllPayouts = '/admin/payouts',
  ProcessPayout = '/admin/payouts/:id/process',
}

// Affiliate endpoints
const requestPayout = (data: RequestPayoutDto) =>
  apiClient.post<Payout>({
    url: PayoutApi.RequestPayout,
    data,
  });

const getMyPayouts = () =>
  apiClient.get<Payout[]>({ url: PayoutApi.GetMyPayouts });

// Admin endpoints
const getAllPayouts = (status?: PayoutStatus) =>
  apiClient.get<Payout[]>({
    url: PayoutApi.GetAllPayouts,
    params: { status },
  });

const processPayout = (id: number, data: ProcessPayoutDto) =>
  apiClient.put<Payout>({
    url: PayoutApi.ProcessPayout.replace(':id', String(id)),
    data,
  });

export default {
  requestPayout,
  getMyPayouts,
  getAllPayouts,
  processPayout,
};
