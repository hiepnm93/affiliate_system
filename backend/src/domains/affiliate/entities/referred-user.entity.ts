export class ReferredUserEntity {
  id: number;
  email: string;
  userId: number | null;
  referralCode: string;
  affiliateId: number;
  cookieId: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    email: string,
    userId: number | null,
    referralCode: string,
    affiliateId: number,
    cookieId: string | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.email = email;
    this.userId = userId;
    this.referralCode = referralCode;
    this.affiliateId = affiliateId;
    this.cookieId = cookieId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(
    email: string,
    referralCode: string,
    affiliateId: number,
    cookieId: string | null = null,
    userId: number | null = null,
  ): Omit<ReferredUserEntity, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      email,
      userId,
      referralCode,
      affiliateId,
      cookieId,
    } as any;
  }

  linkUser(userId: number): void {
    this.userId = userId;
  }

  hasCompletedRegistration(): boolean {
    return this.userId !== null;
  }
}
