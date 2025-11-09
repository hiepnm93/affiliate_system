export enum PayoutStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  PAID = 'paid',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'bank_transfer',
  E_WALLET = 'e_wallet',
  PAYPAL = 'paypal',
  CRYPTO = 'crypto',
}

export class PayoutEntity {
  id: number;
  affiliateId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PayoutStatus;
  requestedAt: Date;
  processedAt?: Date;
  adminNotes?: string;
  paymentDetails?: string; // JSON string for account details
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;

  static create(
    affiliateId: number,
    amount: number,
    paymentMethod: PaymentMethod,
    paymentDetails?: string,
  ): Omit<PayoutEntity, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      affiliateId,
      amount,
      paymentMethod,
      status: PayoutStatus.PENDING,
      requestedAt: new Date(),
      paymentDetails,
    } as any;
  }

  isPending(): boolean {
    return this.status === PayoutStatus.PENDING;
  }

  isProcessing(): boolean {
    return this.status === PayoutStatus.PROCESSING;
  }

  isPaid(): boolean {
    return this.status === PayoutStatus.PAID;
  }

  isFailed(): boolean {
    return this.status === PayoutStatus.FAILED;
  }

  canProcess(): boolean {
    return this.status === PayoutStatus.PENDING;
  }

  canCancel(): boolean {
    return (
      this.status === PayoutStatus.PENDING ||
      this.status === PayoutStatus.PROCESSING
    );
  }
}
