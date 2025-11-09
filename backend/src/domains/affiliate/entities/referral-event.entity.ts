export enum ReferralEventType {
  CLICK = 'click',
  SIGNUP = 'signup',
  PAYMENT = 'payment',
}

export class ReferralEventEntity {
  id: number;
  affiliateId: number;
  referredUserId: number | null;
  eventType: ReferralEventType;
  ipAddress: string;
  userAgent: string;
  cookieId: string | null;
  referrer: string | null;
  metadata: Record<string, any>;
  timestamp: Date;

  constructor(
    id: number,
    affiliateId: number,
    referredUserId: number | null,
    eventType: ReferralEventType,
    ipAddress: string,
    userAgent: string,
    cookieId: string | null,
    referrer: string | null,
    metadata: Record<string, any>,
    timestamp: Date,
  ) {
    this.id = id;
    this.affiliateId = affiliateId;
    this.referredUserId = referredUserId;
    this.eventType = eventType;
    this.ipAddress = ipAddress;
    this.userAgent = userAgent;
    this.cookieId = cookieId;
    this.referrer = referrer;
    this.metadata = metadata;
    this.timestamp = timestamp;
  }

  static createClickEvent(
    affiliateId: number,
    ipAddress: string,
    userAgent: string,
    referrer: string | null,
    cookieId: string,
  ): Omit<ReferralEventEntity, 'id' | 'timestamp'> {
    return {
      affiliateId,
      referredUserId: null,
      eventType: ReferralEventType.CLICK,
      ipAddress,
      userAgent,
      cookieId,
      referrer,
      metadata: {},
    } as any;
  }

  static createSignupEvent(
    affiliateId: number,
    referredUserId: number,
    ipAddress: string,
    userAgent: string,
    cookieId: string | null,
  ): Omit<ReferralEventEntity, 'id' | 'timestamp'> {
    return {
      affiliateId,
      referredUserId,
      eventType: ReferralEventType.SIGNUP,
      ipAddress,
      userAgent,
      cookieId,
      referrer: null,
      metadata: {},
    } as any;
  }

  static createPaymentEvent(
    affiliateId: number,
    referredUserId: number,
    ipAddress: string,
    userAgent: string,
    amount: number,
    currency: string,
  ): Omit<ReferralEventEntity, 'id' | 'timestamp'> {
    return {
      affiliateId,
      referredUserId,
      eventType: ReferralEventType.PAYMENT,
      ipAddress,
      userAgent,
      cookieId: null,
      referrer: null,
      metadata: { amount, currency },
    } as any;
  }

  isClick(): boolean {
    return this.eventType === ReferralEventType.CLICK;
  }

  isSignup(): boolean {
    return this.eventType === ReferralEventType.SIGNUP;
  }

  isPayment(): boolean {
    return this.eventType === ReferralEventType.PAYMENT;
  }
}
