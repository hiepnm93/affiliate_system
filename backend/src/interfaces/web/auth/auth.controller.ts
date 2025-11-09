import { Controller, Post, Body } from '@nestjs/common';
import { RegisterUserUseCase } from '../../../application/auth/register-user.use-case';
import { LoginUseCase, LoginDto } from '../../../application/auth/login.use-case';
import { TrackSignupUseCase } from '../../../application/tracking/track-signup.use-case';

class RegisterDto {
  email: string;
  password: string;
  referralCode?: string;
  cookieId?: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly trackSignupUseCase: TrackSignupUseCase,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    // Register user
    const user = await this.registerUseCase.execute({
      email: dto.email,
      password: dto.password,
    });

    // Track signup if referral code or cookie provided
    if (dto.referralCode || dto.cookieId) {
      await this.trackSignupUseCase.execute({
        userId: user.id,
        email: user.email,
        cookieId: dto.cookieId,
        referralCode: dto.referralCode,
        ipAddress: '0.0.0.0', // Will be extracted from request in real implementation
        userAgent: '', // Will be extracted from request in real implementation
      });
    }

    // Return user without password
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }
}
