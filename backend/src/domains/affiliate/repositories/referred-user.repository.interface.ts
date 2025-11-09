import { ReferredUserEntity } from '../entities/referred-user.entity';

export interface IReferredUserRepository {
  findById(id: number): Promise<ReferredUserEntity | null>;
  findByEmail(email: string): Promise<ReferredUserEntity | null>;
  findByUserId(userId: number): Promise<ReferredUserEntity | null>;
  findByCookieId(cookieId: string): Promise<ReferredUserEntity | null>;
  create(referredUser: Omit<ReferredUserEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ReferredUserEntity>;
  update(id: number, referredUser: Partial<ReferredUserEntity>): Promise<ReferredUserEntity | null>;
  findByAffiliateId(affiliateId: number): Promise<ReferredUserEntity[]>;
}

export const REFERRED_USER_REPOSITORY = Symbol('REFERRED_USER_REPOSITORY');
