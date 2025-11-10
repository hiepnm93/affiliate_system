import { Module } from '@nestjs/common';
import { AuthModule } from '../../../domains/auth/auth.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [AuthModule],
  controllers: [AuthController],
})
export class AuthWebModule {}
