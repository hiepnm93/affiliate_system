/**
 * Affiliate System Types
 */

export enum UserRole {
  ADMIN = 'admin',
  AFFILIATE = 'affiliate',
  USER = 'user',
}

export enum AffiliateStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum CommissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid',
}

export enum PayoutStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  PAID = 'paid',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'bank_transfer',
  E_WALLET = 'e_wallet',
  PAYPAL = 'paypal',
  CRYPTO = 'crypto',
}

export enum CampaignStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
}

export enum RewardType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
  VOUCHER = 'voucher',
}

// Entities
export interface Affiliate {
  id: number;
  userId: number;
  referralCode: string;
  parentAffiliateId: number | null;
  tier: number;
  status: AffiliateStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ReferredUser {
  id: number;
  email: string;
  userId: number | null;
  referralCode: string;
  affiliateId: number;
  createdAt: string;
}

export interface Campaign {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  rewardType: RewardType;
  rewardValue: number;
  multiLevelConfig: Record<number, number>; // { 1: 10, 2: 5, 3: 2 } = Level 1: 10%, Level 2: 5%
  cookieTTLDays: number;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Commission {
  id: number;
  affiliateId: number;
  transactionId: number;
  amount: number;
  level: number;
  campaignId: number;
  status: CommissionStatus;
  payoutId?: number;
  rejectionNotes?: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  affiliate?: Affiliate;
  transaction?: Transaction;
  campaign?: Campaign;
}

export interface Transaction {
  id: number;
  referredUserId: number;
  amount: number;
  currency: string;
  status: string;
  externalId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payout {
  id: number;
  affiliateId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PayoutStatus;
  requestedAt: string;
  processedAt?: string;
  adminNotes?: string;
  paymentDetails?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReferralEvent {
  id: number;
  affiliateId: number;
  referredUserId?: number;
  eventType: 'click' | 'signup' | 'payment';
  ip: string;
  userAgent: string;
  cookieId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

// Dashboard Stats
export interface AffiliateStats {
  totalClicks: number;
  totalSignups: number;
  totalConversions: number;
  totalCommissions: number;
  pendingCommissions: number;
  approvedCommissions: number;
  paidCommissions: number;
  rejectedCommissions: number;
  availableBalance: number;
  totalPaid: number;
}

export interface AffiliateHierarchy {
  id: number;
  referralCode: string;
  tier: number;
  directReferrals: number;
  totalCommissions: number;
  children: AffiliateHierarchy[];
}

// API Request/Response Types
export interface RequestPayoutDto {
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDetails?: string;
}

export interface ProcessPayoutDto {
  status: 'paid' | 'failed';
  adminNotes?: string;
  failureReason?: string;
}

export interface ApproveCommissionDto {
  notes?: string;
}

export interface RejectCommissionDto {
  rejectionNotes: string;
}

export interface CreateCampaignDto {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  rewardType: RewardType;
  rewardValue: number;
  multiLevelConfig: Record<number, number>;
  cookieTTLDays: number;
}

export interface UpdateCampaignDto extends Partial<CreateCampaignDto> {
  status?: CampaignStatus;
}

export interface RegisterAsAffiliateDto {
  email: string;
  password: string;
  referralCode?: string; // Parent affiliate's code
}

export interface SystemReports {
  overview: {
    totalAffiliates: number;
    totalReferrals: number;
    totalCommissions: number;
    totalPaid: number;
    conversionRate: number;
  };
  commissions: {
    pending: number;
    approved: number;
    paid: number;
    rejected: number;
  };
  payouts: {
    pending: number;
    processing: number;
    paid: number;
    failed: number;
  };
}
