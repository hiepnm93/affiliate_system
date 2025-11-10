import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import {
  IAffiliateRepository,
  AFFILIATE_REPOSITORY,
} from '../../domains/affiliate/repositories/affiliate.repository.interface';

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @Inject(AFFILIATE_REPOSITORY)
    private affiliateRepository: IAffiliateRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_SECRET',
        'your-secret-key-change-this-in-production',
      ),
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Invalid token');
    }

    // Get affiliate ID if user is an affiliate
    let affiliateId: number | undefined;
    const affiliate = await this.affiliateRepository.findByUserId(payload.sub);
    if (affiliate) {
      affiliateId = affiliate.id;
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      affiliateId,
    };
  }
}
