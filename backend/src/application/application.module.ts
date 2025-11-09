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

@Module({
  imports: [
    InfrastructureModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'your-secret-key-change-this-in-production'),
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
  ],
  exports: [
    RegisterUserUseCase,
    LoginUseCase,
    GenerateReferralCodeUseCase,
    TrackClickUseCase,
    TrackSignupUseCase,
  ],
})
export class ApplicationModule {}
