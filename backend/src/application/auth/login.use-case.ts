import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domains/user/repositories/user.repository.interface';

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResponse> {
    // Find user
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
