import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  ICommissionRepository,
  COMMISSION_REPOSITORY,
} from '../../domains/commission/repositories/commission.repository.interface';
import { CommissionEntity } from '../../domains/commission/entities/commission.entity';

@Injectable()
export class ApproveCommissionUseCase {
  constructor(
    @Inject(COMMISSION_REPOSITORY)
    private readonly commissionRepository: ICommissionRepository,
  ) {}

  async execute(commissionId: number): Promise<CommissionEntity> {
    const commission = await this.commissionRepository.findById(commissionId);
    if (!commission) {
      throw new NotFoundException('Commission not found');
    }

    commission.approve();

    const updated = await this.commissionRepository.update(commission.id, {
      status: commission.status,
    } as any);

    if (!updated) {
      throw new NotFoundException('Commission not found');
    }

    return updated;
  }
}
