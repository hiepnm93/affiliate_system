import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '../../../infrastructure/auth/roles.guard';
import { Roles } from '../../../infrastructure/auth/roles.decorator';
import { UserRole } from '../../../domains/user/entities/user.entity';
import { ApproveCommissionUseCase } from '../../../application/commission/approve-commission.use-case';
import {
  RejectCommissionUseCase,
  RejectCommissionDto,
} from '../../../application/commission/reject-commission.use-case';

@Controller('admin/commissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class CommissionController {
  constructor(
    private readonly approveCommissionUseCase: ApproveCommissionUseCase,
    private readonly rejectCommissionUseCase: RejectCommissionUseCase,
  ) {}

  @Put(':id/approve')
  async approveCommission(@Param('id') id: string) {
    const commission = await this.approveCommissionUseCase.execute(Number(id));
    return {
      id: commission.id,
      affiliateId: commission.affiliateId,
      transactionId: commission.transactionId,
      amount: commission.amount,
      level: commission.level,
      status: commission.status,
    };
  }

  @Put(':id/reject')
  async rejectCommission(
    @Param('id') id: string,
    @Body() body: { notes: string },
  ) {
    const commission = await this.rejectCommissionUseCase.execute({
      commissionId: Number(id),
      notes: body.notes,
    });
    return {
      id: commission.id,
      affiliateId: commission.affiliateId,
      transactionId: commission.transactionId,
      amount: commission.amount,
      level: commission.level,
      status: commission.status,
      notes: commission.notes,
    };
  }
}
