import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Inject,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '../../../infrastructure/auth/roles.guard';
import { Roles } from '../../../infrastructure/auth/roles.decorator';
import { UserRole } from '../../../domains/user/entities/user.entity';
import { RequestPayoutUseCase } from '../../../application/payout/request-payout.use-case';
import {
  IPayoutRepository,
  PAYOUT_REPOSITORY,
} from '../../../domains/payout/repositories/payout.repository.interface';
import { RequestPayoutDto } from './dto/request-payout.dto';

@Controller('affiliate/payouts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.AFFILIATE)
export class AffiliatePayoutController {
  constructor(
    private readonly requestPayoutUseCase: RequestPayoutUseCase,
    @Inject(PAYOUT_REPOSITORY)
    private readonly payoutRepository: IPayoutRepository,
  ) {}

  @Post()
  async requestPayout(@Request() req, @Body() dto: RequestPayoutDto) {
    const affiliateId = req.user.affiliateId; // Assume JWT payload has affiliateId

    const payout = await this.requestPayoutUseCase.execute({
      affiliateId,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
      paymentDetails: dto.paymentDetails,
    });

    return {
      success: true,
      data: {
        id: payout.id,
        amount: payout.amount,
        paymentMethod: payout.paymentMethod,
        status: payout.status,
        requestedAt: payout.requestedAt,
      },
    };
  }

  @Get()
  async getPayoutHistory(@Request() req) {
    const affiliateId = req.user.affiliateId;

    const payouts = await this.payoutRepository.findByAffiliateId(affiliateId);

    return {
      success: true,
      data: payouts.map((payout) => ({
        id: payout.id,
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
}
