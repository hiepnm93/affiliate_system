import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  ICommissionRepository,
  COMMISSION_REPOSITORY,
} from '../../domains/commission/repositories/commission.repository.interface';
import { CommissionEntity } from '../../domains/commission/entities/commission.entity';

export interface RejectCommissionDto {
  commissionId: number;
  notes: string;
}

@Injectable()
export class RejectCommissionUseCase {
  constructor(
    @Inject(COMMISSION_REPOSITORY)
    private readonly commissionRepository: ICommissionRepository,
  ) {}

  async execute(dto: RejectCommissionDto): Promise<CommissionEntity> {
    const commission = await this.commissionRepository.findById(dto.commissionId);
    if (!commission) {
      throw new NotFoundException('Commission not found');
    }

    commission.reject(dto.notes);

    const updated = await this.commissionRepository.update(commission.id, {
      status: commission.status,
      notes: commission.notes,
    } as any);

    if (!updated) {
      throw new NotFoundException('Commission not found');
    }

    return updated;
  }
}
