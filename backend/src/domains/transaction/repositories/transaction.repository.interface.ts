import { TransactionEntity } from '../entities/transaction.entity';

export interface ITransactionRepository {
  findById(id: number): Promise<TransactionEntity | null>;
  findByExternalId(externalId: string): Promise<TransactionEntity | null>;
  findByReferredUserId(referredUserId: number): Promise<TransactionEntity[]>;
  create(
    transaction: Omit<TransactionEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<TransactionEntity>;
  update(
    id: number,
    transaction: Partial<TransactionEntity>,
  ): Promise<TransactionEntity | null>;
}

export const TRANSACTION_REPOSITORY = Symbol('TRANSACTION_REPOSITORY');
