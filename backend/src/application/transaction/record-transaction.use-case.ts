import { Injectable, Inject, ConflictException } from '@nestjs/common';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../domains/transaction/repositories/transaction.repository.interface';
import { TransactionEntity } from '../../domains/transaction/entities/transaction.entity';

export interface RecordTransactionDto {
  referredUserId: number;
  amount: number;
  currency: string;
  externalId: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class RecordTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(dto: RecordTransactionDto): Promise<TransactionEntity> {
    // Check for duplicate transaction
    const existing = await this.transactionRepository.findByExternalId(
      dto.externalId,
    );
    if (existing) {
      throw new ConflictException('Transaction already exists');
    }

    // Create transaction
    const transaction = TransactionEntity.create(
      dto.referredUserId,
      dto.amount,
      dto.currency,
      dto.externalId,
      dto.metadata || {},
    );

    const savedTransaction =
      await this.transactionRepository.create(transaction);

    // Mark as completed
    savedTransaction.complete();
    await this.transactionRepository.update(savedTransaction.id, {
      status: savedTransaction.status,
    } as any);

    return savedTransaction;
  }
}
