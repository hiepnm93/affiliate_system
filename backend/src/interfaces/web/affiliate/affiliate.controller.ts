import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { GenerateReferralCodeUseCase } from '../../../application/affiliate/generate-referral-code.use-case';
import { TrackClickUseCase } from '../../../application/tracking/track-click.use-case';

class BecomeAffiliateDto {
  parentReferralCode?: string;
}

@Controller('affiliate')
export class AffiliateController {
  constructor(
    private readonly generateReferralCodeUseCase: GenerateReferralCodeUseCase,
    private readonly trackClickUseCase: TrackClickUseCase,
  ) {}

  // This endpoint would be protected with JWT guard in real implementation
  @Post('become-affiliate')
  async becomeAffiliate(
    @Body() dto: BecomeAffiliateDto,
    @Request() req: any,
  ) {
    const userId = req.user?.sub || 1; // Mock user ID for now

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
    @Query('code') code: string,
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
  async getMyReferralCode(@Request() req: any) {
    const userId = req.user?.sub || 1; // Mock user ID for now

    const affiliate = await this.generateReferralCodeUseCase.execute(userId);

    return {
      referralCode: affiliate.referralCode,
      shareableLink: `/r/${affiliate.referralCode}`,
    };
  }
}
