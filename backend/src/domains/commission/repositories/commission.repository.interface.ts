import { CommissionEntity, CommissionStatus } from '../entities/commission.entity';

export interface ICommissionRepository {
  findById(id: number): Promise<CommissionEntity | null>;
  findByAffiliateId(affiliateId: number, status?: CommissionStatus): Promise<CommissionEntity[]>;
  findByTransactionId(transactionId: number): Promise<CommissionEntity[]>;
  findPendingCommissions(): Promise<CommissionEntity[]>;
  getTotalEarnings(affiliateId: number, status?: CommissionStatus): Promise<number>;
  create(commission: Omit<CommissionEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<CommissionEntity>;
  update(id: number, commission: Partial<CommissionEntity>): Promise<CommissionEntity | null>;
  bulkCreate(commissions: Omit<CommissionEntity, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<CommissionEntity[]>;
}

export const COMMISSION_REPOSITORY = Symbol('COMMISSION_REPOSITORY');
