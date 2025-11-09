export enum CommissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid',
}

export class CommissionEntity {
  id: number;
  affiliateId: number;
  transactionId: number;
  campaignId: number;
  amount: number;
  level: number; // 1, 2, 3, etc.
  status: CommissionStatus;
  notes: string | null;
  payoutId: number | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    affiliateId: number,
    transactionId: number,
    campaignId: number,
    amount: number,
    level: number,
    status: CommissionStatus,
    notes: string | null,
    payoutId: number | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.affiliateId = affiliateId;
    this.transactionId = transactionId;
    this.campaignId = campaignId;
    this.amount = amount;
    this.level = level;
    this.status = status;
    this.notes = notes;
    this.payoutId = payoutId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(
    affiliateId: number,
    transactionId: number,
    campaignId: number,
    amount: number,
    level: number,
  ): Omit<CommissionEntity, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      affiliateId,
      transactionId,
      campaignId,
      amount,
      level,
      status: CommissionStatus.PENDING,
      notes: null,
      payoutId: null,
    } as any;
  }

  approve(): void {
    this.status = CommissionStatus.APPROVED;
  }

  reject(notes: string): void {
    this.status = CommissionStatus.REJECTED;
    this.notes = notes;
  }

  markAsPaid(payoutId: number): void {
    this.status = CommissionStatus.PAID;
    this.payoutId = payoutId;
  }

  isPending(): boolean {
    return this.status === CommissionStatus.PENDING;
  }

  isApproved(): boolean {
    return this.status === CommissionStatus.APPROVED;
  }

  isPaid(): boolean {
    return this.status === CommissionStatus.PAID;
  }
}
