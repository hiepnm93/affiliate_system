import { Module } from '@nestjs/common';
import { GetSystemReportsUseCase } from './get-system-reports.use-case';

@Module({
  providers: [GetSystemReportsUseCase],
  exports: [GetSystemReportsUseCase],
})
export class ReportsApplicationModule {}
