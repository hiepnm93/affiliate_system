export enum AffiliateStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export class AffiliateEntity {
  id: number;
  userId: number;
  referralCode: string;
  parentAffiliateId: number | null;
  tier: number;
  status: AffiliateStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    userId: number,
    referralCode: string,
    parentAffiliateId: number | null,
    tier: number,
    status: AffiliateStatus,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.referralCode = referralCode;
    this.parentAffiliateId = parentAffiliateId;
    this.tier = tier;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(
    userId: number,
    referralCode: string,
    parentAffiliateId: number | null = null,
  ): Omit<AffiliateEntity, 'id' | 'createdAt' | 'updatedAt'> {
    const now = new Date();
    return {
      userId,
      referralCode,
      parentAffiliateId,
      tier: parentAffiliateId ? 0 : 0, // Will be calculated from parent
      status: AffiliateStatus.ACTIVE,
    } as any;
  }

  isActive(): boolean {
    return this.status === AffiliateStatus.ACTIVE;
  }

  deactivate(): void {
    this.status = AffiliateStatus.INACTIVE;
  }

  suspend(): void {
    this.status = AffiliateStatus.SUSPENDED;
  }

  activate(): void {
    this.status = AffiliateStatus.ACTIVE;
  }
}
