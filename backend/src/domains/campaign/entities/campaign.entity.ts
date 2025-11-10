export enum RewardType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
  VOUCHER = 'voucher',
}

export enum CampaignStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
}

export interface MultiLevelConfig {
  [level: number]: number; // level -> percentage or fixed amount
}

export class CampaignEntity {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  rewardType: RewardType;
  rewardValue: number; // Percentage (10 = 10%) or fixed amount
  multiLevelConfig: MultiLevelConfig;
  cookieTTL: number; // Days
  status: CampaignStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    name: string,
    startDate: Date,
    endDate: Date,
    rewardType: RewardType,
    rewardValue: number,
    multiLevelConfig: MultiLevelConfig,
    cookieTTL: number,
    status: CampaignStatus,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.rewardType = rewardType;
    this.rewardValue = rewardValue;
    this.multiLevelConfig = multiLevelConfig;
    this.cookieTTL = cookieTTL;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(
    name: string,
    startDate: Date,
    endDate: Date,
    rewardType: RewardType,
    rewardValue: number,
    multiLevelConfig: MultiLevelConfig,
    cookieTTL: number = 30,
  ): Omit<CampaignEntity, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      name,
      startDate,
      endDate,
      rewardType,
      rewardValue,
      multiLevelConfig,
      cookieTTL,
      status: CampaignStatus.ACTIVE,
    } as any;
  }

  isActive(now: Date = new Date()): boolean {
    return (
      this.status === CampaignStatus.ACTIVE &&
      now >= this.startDate &&
      now <= this.endDate
    );
  }

  activate(): void {
    this.status = CampaignStatus.ACTIVE;
  }

  deactivate(): void {
    this.status = CampaignStatus.INACTIVE;
  }

  markExpired(): void {
    this.status = CampaignStatus.EXPIRED;
  }

  getCommissionForLevel(level: number): number {
    return this.multiLevelConfig[level] || 0;
  }
}
