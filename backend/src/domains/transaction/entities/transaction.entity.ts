export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export class TransactionEntity {
  id: number;
  referredUserId: number;
  amount: number;
  currency: string;
  status: TransactionStatus;
  externalId: string; // From payment provider
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    referredUserId: number,
    amount: number,
    currency: string,
    status: TransactionStatus,
    externalId: string,
    metadata: Record<string, any>,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.referredUserId = referredUserId;
    this.amount = amount;
    this.currency = currency;
    this.status = status;
    this.externalId = externalId;
    this.metadata = metadata;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(
    referredUserId: number,
    amount: number,
    currency: string,
    externalId: string,
    metadata: Record<string, any> = {},
  ): Omit<TransactionEntity, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      referredUserId,
      amount,
      currency,
      status: TransactionStatus.PENDING,
      externalId,
      metadata,
    } as any;
  }

  complete(): void {
    this.status = TransactionStatus.COMPLETED;
  }

  fail(): void {
    this.status = TransactionStatus.FAILED;
  }

  refund(): void {
    this.status = TransactionStatus.REFUNDED;
  }

  isCompleted(): boolean {
    return this.status === TransactionStatus.COMPLETED;
  }
}
