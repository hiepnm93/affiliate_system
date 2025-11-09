import { PayoutEntity, PayoutStatus } from '../entities/payout.entity';

export interface IPayoutRepository {
  create(
    payout: Omit<PayoutEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<PayoutEntity>;
  findById(id: number): Promise<PayoutEntity | null>;
  findByAffiliateId(affiliateId: number): Promise<PayoutEntity[]>;
  findByStatus(status: PayoutStatus): Promise<PayoutEntity[]>;
  findAll(filters?: {
    status?: PayoutStatus;
    affiliateId?: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<PayoutEntity[]>;
  update(id: number, data: Partial<PayoutEntity>): Promise<PayoutEntity | null>;
  getTotalPaidAmount(affiliateId: number): Promise<number>;
}

export const PAYOUT_REPOSITORY = Symbol('PAYOUT_REPOSITORY');
