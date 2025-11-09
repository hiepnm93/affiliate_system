import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  Query,
  ParseIntPipe,
  Inject,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '../../../infrastructure/auth/roles.guard';
import { Roles } from '../../../infrastructure/auth/roles.decorator';
import { UserRole } from '../../../domains/user/entities/user.entity';
import { ProcessPayoutUseCase } from '../../../application/payout/process-payout.use-case';
import {
  IPayoutRepository,
  PAYOUT_REPOSITORY,
} from '../../../domains/payout/repositories/payout.repository.interface';
import { ProcessPayoutDto } from './dto/process-payout.dto';
import { PayoutStatus } from '../../../domains/payout/entities/payout.entity';

@Controller('admin/payouts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminPayoutController {
  constructor(
    private readonly processPayoutUseCase: ProcessPayoutUseCase,
    @Inject(PAYOUT_REPOSITORY)
    private readonly payoutRepository: IPayoutRepository,
  ) {}

  @Get()
  async getAllPayouts(@Query('status') status?: PayoutStatus) {
    const payouts = status
      ? await this.payoutRepository.findByStatus(status)
      : await this.payoutRepository.findAll();

    return {
      success: true,
      data: payouts.map((payout) => ({
        id: payout.id,
        affiliateId: payout.affiliateId,
        amount: payout.amount,
        paymentMethod: payout.paymentMethod,
        status: payout.status,
        requestedAt: payout.requestedAt,
        processedAt: payout.processedAt,
        adminNotes: payout.adminNotes,
        failureReason: payout.failureReason,
      })),
    };
  }

  @Put(':id/process')
  async processPayout(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProcessPayoutDto,
  ) {
    const payout = await this.processPayoutUseCase.execute({
      payoutId: id,
      status: dto.status,
      adminNotes: dto.adminNotes,
      failureReason: dto.failureReason,
    });

    return {
      success: true,
      data: {
        id: payout.id,
        status: payout.status,
        processedAt: payout.processedAt,
        adminNotes: payout.adminNotes,
      },
    };
  }
}
