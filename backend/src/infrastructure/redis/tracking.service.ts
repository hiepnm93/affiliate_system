import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export interface TrackingCookie {
  affiliateId: number;
  referralCode: string;
  timestamp: Date;
}

@Injectable()
export class TrackingService {
  private redis: Redis;
  private readonly cookieTTL: number;

  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD'),
      db: this.configService.get('REDIS_DB', 0),
    });

    this.cookieTTL = this.configService.get('COOKIE_TTL_DAYS', 30) * 86400; // Convert to seconds
  }

  async setTrackingCookie(
    cookieId: string,
    data: TrackingCookie,
  ): Promise<void> {
    const key = `tracking:${cookieId}`;
    await this.redis.setex(key, this.cookieTTL, JSON.stringify(data));
  }

  async getTrackingCookie(
    cookieId: string,
  ): Promise<TrackingCookie | null> {
    const key = `tracking:${cookieId}`;
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async deleteTrackingCookie(cookieId: string): Promise<void> {
    const key = `tracking:${cookieId}`;
    await this.redis.del(key);
  }

  async extendTrackingCookie(cookieId: string): Promise<void> {
    const key = `tracking:${cookieId}`;
    await this.redis.expire(key, this.cookieTTL);
  }

  generateCookieId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  onModuleDestroy() {
    this.redis.disconnect();
  }
}
