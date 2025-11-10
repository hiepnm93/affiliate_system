import { IsNumber, IsEnum, IsString, IsOptional, Min } from 'class-validator';
import { PaymentMethod } from '../../../../domains/payout/entities/payout.entity';

export class RequestPayoutDto {
  @IsNumber()
  @Min(50, { message: 'Minimum payout amount is $50' })
  amount: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsString()
  paymentDetails?: string;
}
