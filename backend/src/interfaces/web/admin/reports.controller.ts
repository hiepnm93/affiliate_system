import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '../../../infrastructure/auth/roles.guard';
import { Roles } from '../../../infrastructure/auth/roles.decorator';
import { UserRole } from '../../../domains/user/entities/user.entity';
import { GetSystemReportsUseCase } from '../../../application/reports/get-system-reports.use-case';

@Controller('admin/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminReportsController {
  constructor(
    private readonly getSystemReportsUseCase: GetSystemReportsUseCase,
  ) {}

  @Get()
  async getSystemReports() {
    const reports = await this.getSystemReportsUseCase.execute();

    return {
      success: true,
      data: reports,
    };
  }
}
