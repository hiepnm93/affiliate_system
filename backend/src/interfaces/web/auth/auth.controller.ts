import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserUseCase } from '../../../application/auth/register-user.use-case';
import { LoginUseCase } from '../../../application/auth/login.use-case';
import { TrackSignupUseCase } from '../../../application/tracking/track-signup.use-case';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly trackSignupUseCase: TrackSignupUseCase,
    private readonly jwtService: JwtService,
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

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    // Return access token and user
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }
}
