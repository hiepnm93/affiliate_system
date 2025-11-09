import { Injectable, ConflictException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domains/user/repositories/user.repository.interface';
import { UserEntity, UserRole } from '../../domains/user/entities/user.entity';

export interface RegisterUserDto {
  email: string;
  password: string;
  role?: UserRole;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: RegisterUserDto): Promise<UserEntity> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = UserEntity.create(
      dto.email,
      hashedPassword,
      dto.role || UserRole.USER,
    );

    return this.userRepository.create(user);
  }
}
