import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

// Auth Use Cases
import { RegisterUserUseCase } from './auth/register-user.use-case';
import { LoginUseCase } from './auth/login.use-case';

// Affiliate Use Cases
import { GenerateReferralCodeUseCase } from './affiliate/generate-referral-code.use-case';

// Tracking Use Cases
import { TrackClickUseCase } from './tracking/track-click.use-case';
import { TrackSignupUseCase } from './tracking/track-signup.use-case';

// Campaign Use Cases
import { CreateCampaignUseCase } from './campaign/create-campaign.use-case';
import { GetActiveCampaignUseCase } from './campaign/get-active-campaign.use-case';

// Transaction Use Cases
import { RecordTransactionUseCase } from './transaction/record-transaction.use-case';

// Commission Use Cases
import { CalculateCommissionUseCase } from './commission/calculate-commission.use-case';
import { ApproveCommissionUseCase } from './commission/approve-commission.use-case';
import { RejectCommissionUseCase } from './commission/reject-commission.use-case';

// Payout Use Cases
import { RequestPayoutUseCase } from './payout/request-payout.use-case';
import { ProcessPayoutUseCase } from './payout/process-payout.use-case';

// Reports Use Cases
import { GetSystemReportsUseCase } from './reports/get-system-reports.use-case';

@Module({
  imports: [
    InfrastructureModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(
          'JWT_SECRET',
          'your-secret-key-change-this-in-production',
        ),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    // Auth Use Cases
    RegisterUserUseCase,
    LoginUseCase,
    // Affiliate Use Cases
    GenerateReferralCodeUseCase,
    // Tracking Use Cases
    TrackClickUseCase,
    TrackSignupUseCase,
    // Campaign Use Cases
    CreateCampaignUseCase,
    GetActiveCampaignUseCase,
    // Transaction Use Cases
    RecordTransactionUseCase,
    // Commission Use Cases
    CalculateCommissionUseCase,
    ApproveCommissionUseCase,
    RejectCommissionUseCase,
    // Payout Use Cases
    RequestPayoutUseCase,
    ProcessPayoutUseCase,
    // Reports Use Cases
    GetSystemReportsUseCase,
  ],
  exports: [
    RegisterUserUseCase,
    LoginUseCase,
    GenerateReferralCodeUseCase,
    TrackClickUseCase,
    TrackSignupUseCase,
    CreateCampaignUseCase,
    GetActiveCampaignUseCase,
    RecordTransactionUseCase,
    CalculateCommissionUseCase,
    ApproveCommissionUseCase,
    RejectCommissionUseCase,
    RequestPayoutUseCase,
    ProcessPayoutUseCase,
    GetSystemReportsUseCase,
  ],
})
export class ApplicationModule {}
