import { IsEnum, IsString, IsOptional } from 'class-validator';

export class ProcessPayoutDto {
  @IsEnum(['paid', 'failed'])
  status: 'paid' | 'failed';

  @IsOptional()
  @IsString()
  adminNotes?: string;

  @IsOptional()
  @IsString()
  failureReason?: string;
}
