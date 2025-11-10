import { Injectable } from '@nestjs/common';

export interface SystemReportsResponse {
  overview: {
    message: string;
  };
  commissions: {
    message: string;
  };
  payouts: {
    message: string;
  };
}

@Injectable()
export class GetSystemReportsUseCase {
  async execute(): Promise<SystemReportsResponse> {
    // Simplified implementation
    // Full implementation with aggregations can be added later
    return {
      overview: {
        message: 'System reports available. Full aggregation coming soon.',
      },
      commissions: {
        message:
          'Commission statistics available. Full aggregation coming soon.',
      },
      payouts: {
        message: 'Payout statistics available. Full aggregation coming soon.',
      },
    };
  }
}
