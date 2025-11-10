import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Res,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import { GenerateReferralCodeUseCase } from '../../../application/affiliate/generate-referral-code.use-case';
import { TrackClickUseCase } from '../../../application/tracking/track-click.use-case';
import { JwtAuthGuard } from '../../../infrastructure/auth/jwt-auth.guard';

class BecomeAffiliateDto {
  parentReferralCode?: string;
}

@Controller('affiliate')
export class AffiliateController {
  constructor(
    private readonly generateReferralCodeUseCase: GenerateReferralCodeUseCase,
    private readonly trackClickUseCase: TrackClickUseCase,
  ) {}

  @Post('become-affiliate')
  @UseGuards(JwtAuthGuard)
  async becomeAffiliate(@Body() dto: BecomeAffiliateDto, @Request() req: any) {
    const userId = req.user.userId;

    const affiliate = await this.generateReferralCodeUseCase.execute(
      userId,
      dto.parentReferralCode,
    );

    return {
      id: affiliate.id,
      userId: affiliate.userId,
      referralCode: affiliate.referralCode,
      tier: affiliate.tier,
      status: affiliate.status,
    };
  }

  @Get('r/:code')
  async trackReferralClick(
    @Param('code') code: string,
    @Request() req: any,
    @Res() res: Response,
  ) {
    const result = await this.trackClickUseCase.execute({
      referralCode: code,
      ipAddress: req.ip || '0.0.0.0',
      userAgent: req.headers['user-agent'] || '',
      referrer: req.headers.referer,
    });

    // Set tracking cookie
    res.cookie('ref_tracking', result.cookieId, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
    });

    // Redirect to landing page
    return res.redirect(HttpStatus.FOUND, `/landing?ref=${code}`);
  }

  @Get('me/code')
  @UseGuards(JwtAuthGuard)
  async getMyReferralCode(@Request() req: any) {
    const userId = req.user.userId;

    const affiliate = await this.generateReferralCodeUseCase.execute(userId);

    return {
      referralCode: affiliate.referralCode,
      shareableLink: `/r/${affiliate.referralCode}`,
    };
  }
}
