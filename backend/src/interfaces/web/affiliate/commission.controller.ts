import {
  Controller,
  Get,
  UseGuards,
  Request,
  Inject,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '../../../infrastructure/auth/roles.guard';
import { Roles } from '../../../infrastructure/auth/roles.decorator';
import { UserRole } from '../../../domains/user/entities/user.entity';
import {
  ICommissionRepository,
  COMMISSION_REPOSITORY,
} from '../../../domains/commission/repositories/commission.repository.interface';
import { CommissionStatus } from '../../../domains/commission/entities/commission.entity';

@Controller('affiliate/commissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.AFFILIATE)
export class AffiliateCommissionController {
  constructor(
    @Inject(COMMISSION_REPOSITORY)
    private readonly commissionRepository: ICommissionRepository,
  ) {}

  @Get()
  async getCommissions(
    @Request() req,
    @Query('status') status?: CommissionStatus,
  ) {
    const affiliateId = req.user.affiliateId;

    if (!affiliateId) {
      return {
        success: false,
        message: 'User is not an affiliate',
        data: [],
      };
    }

    const commissions = await this.commissionRepository.findByAffiliateId(
      affiliateId,
      status,
    );

    return {
      success: true,
      data: commissions.map((commission) => ({
        id: commission.id,
        transactionId: commission.transactionId,
        campaignId: commission.campaignId,
        amount: commission.amount,
        level: commission.level,
        status: commission.status,
        notes: commission.notes,
        payoutId: commission.payoutId,
        createdAt: commission.createdAt,
        updatedAt: commission.updatedAt,
      })),
    };
  }

  @Get('earnings')
  async getTotalEarnings(@Request() req, @Query('status') status?: CommissionStatus) {
    const affiliateId = req.user.affiliateId;

    if (!affiliateId) {
      return {
        success: false,
        message: 'User is not an affiliate',
        data: { total: 0 },
      };
    }

    const total = await this.commissionRepository.getTotalEarnings(
      affiliateId,
      status,
    );

    // Get breakdown by status
    const [pending, approved, paid] = await Promise.all([
      this.commissionRepository.getTotalEarnings(affiliateId, CommissionStatus.PENDING),
      this.commissionRepository.getTotalEarnings(affiliateId, CommissionStatus.APPROVED),
      this.commissionRepository.getTotalEarnings(affiliateId, CommissionStatus.PAID),
    ]);

    return {
      success: true,
      data: {
        total,
        pending,
        approved,
        paid,
      },
    };
  }
}
