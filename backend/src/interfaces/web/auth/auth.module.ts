import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ApplicationModule } from '../../../application/application.module';
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module';
import { JwtStrategy } from '../../../infrastructure/auth/jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [ApplicationModule, InfrastructureModule, PassportModule],
  controllers: [AuthController],
  providers: [JwtStrategy],
})
export class AuthModule {}
