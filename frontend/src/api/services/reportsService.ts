import apiClient from '../apiClient';
import type { SystemReports } from '@/types/affiliate';

export enum ReportsApi {
  GetSystemReports = '/admin/reports',
}

const getSystemReports = (startDate?: string, endDate?: string) =>
  apiClient.get<SystemReports>({
    url: ReportsApi.GetSystemReports,
    params: { startDate, endDate },
  });

export default {
  getSystemReports,
};
