import { AffiliateEntity } from '../entities/affiliate.entity';

export interface IAffiliateRepository {
  findById(id: number): Promise<AffiliateEntity | null>;
  findByUserId(userId: number): Promise<AffiliateEntity | null>;
  findByReferralCode(code: string): Promise<AffiliateEntity | null>;
  create(affiliate: Omit<AffiliateEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<AffiliateEntity>;
  update(id: number, affiliate: Partial<AffiliateEntity>): Promise<AffiliateEntity | null>;
  findChildren(parentId: number): Promise<AffiliateEntity[]>;
  findParentChain(affiliateId: number): Promise<AffiliateEntity[]>;
}

export const AFFILIATE_REPOSITORY = Symbol('AFFILIATE_REPOSITORY');
