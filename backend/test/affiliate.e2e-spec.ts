import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import { UserOrmEntity } from '../src/infrastructure/postgres/entities/user.orm-entity';
import { AffiliateOrmEntity } from '../src/infrastructure/postgres/entities/affiliate.orm-entity';
import { CommissionOrmEntity } from '../src/infrastructure/postgres/entities/commission.orm-entity';
import { PayoutOrmEntity } from '../src/infrastructure/postgres/entities/payout.orm-entity';
import { UserRole } from '../src/domains/user/entities/user.entity';
import { AffiliateStatus } from '../src/domains/affiliate/entities/affiliate.entity';
import { CommissionStatus } from '../src/domains/commission/entities/commission.entity';
import { PayoutStatus, PaymentMethod } from '../src/domains/payout/entities/payout.entity';

describe('Affiliate API (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<UserOrmEntity>;
  let affiliateRepository: Repository<AffiliateOrmEntity>;
  let commissionRepository: Repository<CommissionOrmEntity>;
  let payoutRepository: Repository<PayoutOrmEntity>;
  let affiliateToken: string;
  let affiliateUser: UserOrmEntity;
  let affiliate: AffiliateOrmEntity;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    userRepository = moduleFixture.get<Repository<UserOrmEntity>>(
      getRepositoryToken(UserOrmEntity),
    );
    affiliateRepository = moduleFixture.get<Repository<AffiliateOrmEntity>>(
      getRepositoryToken(AffiliateOrmEntity),
    );
    commissionRepository = moduleFixture.get<Repository<CommissionOrmEntity>>(
      getRepositoryToken(CommissionOrmEntity),
    );
    payoutRepository = moduleFixture.get<Repository<PayoutOrmEntity>>(
      getRepositoryToken(PayoutOrmEntity),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clear all tables
    await payoutRepository.clear();
    await commissionRepository.clear();
    await affiliateRepository.clear();
    await userRepository.clear();

    // Create an affiliate user and get token
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'affiliate@example.com',
        password: 'password123',
      });

    affiliateToken = registerResponse.body.accessToken;
    affiliateUser = await userRepository.findOne({
      where: { email: 'affiliate@example.com' },
    });

    // Update user role to AFFILIATE
    affiliateUser.role = UserRole.AFFILIATE;
    await userRepository.save(affiliateUser);

    // Create affiliate record
    affiliate = await affiliateRepository.save({
      userId: affiliateUser.id,
      referralCode: 'TEST123',
      parentAffiliateId: null,
      tier: 1,
      status: AffiliateStatus.ACTIVE,
    });
  });

  describe('POST /affiliate/become-affiliate', () => {
    it('should allow user to become affiliate', async () => {
      // Create a regular user
      const regResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
        });

      const token = regResponse.body.accessToken;

      const response = await request(app.getHttpServer())
        .post('/affiliate/become-affiliate')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(201);

      expect(response.body).toHaveProperty('referralCode');
      expect(response.body).toHaveProperty('userId');
      expect(response.body.status).toBe(AffiliateStatus.ACTIVE);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .post('/affiliate/become-affiliate')
        .send({})
        .expect(401);
    });
  });

  describe('GET /affiliate/commissions', () => {
    beforeEach(async () => {
      // Create test commissions
      await commissionRepository.save([
        {
          affiliateId: affiliate.id,
          transactionId: 1,
          campaignId: 1,
          amount: 10.0,
          level: 1,
          status: CommissionStatus.PENDING,
          notes: null,
          payoutId: null,
        },
        {
          affiliateId: affiliate.id,
          transactionId: 2,
          campaignId: 1,
          amount: 15.0,
          level: 1,
          status: CommissionStatus.APPROVED,
          notes: null,
          payoutId: null,
        },
        {
          affiliateId: affiliate.id,
          transactionId: 3,
          campaignId: 1,
          amount: 20.0,
          level: 1,
          status: CommissionStatus.PAID,
          notes: null,
          payoutId: 1,
        },
      ]);
    });

    it('should get all commissions for affiliate', async () => {
      const response = await request(app.getHttpServer())
        .get('/affiliate/commissions')
        .set('Authorization', `Bearer ${affiliateToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0]).toHaveProperty('amount');
      expect(response.body.data[0]).toHaveProperty('status');
    });

    it('should filter commissions by status', async () => {
      const response = await request(app.getHttpServer())
        .get('/affiliate/commissions?status=approved')
        .set('Authorization', `Bearer ${affiliateToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe(CommissionStatus.APPROVED);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get('/affiliate/commissions')
        .expect(401);
    });

    it('should fail for non-affiliate users', async () => {
      // Create regular user
      const regResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'regular@example.com',
          password: 'password123',
        });

      const token = regResponse.body.accessToken;

      const response = await request(app.getHttpServer())
        .get('/affiliate/commissions')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('GET /affiliate/commissions/earnings', () => {
    beforeEach(async () => {
      await commissionRepository.save([
        {
          affiliateId: affiliate.id,
          transactionId: 1,
          campaignId: 1,
          amount: 10.0,
          level: 1,
          status: CommissionStatus.PENDING,
          notes: null,
          payoutId: null,
        },
        {
          affiliateId: affiliate.id,
          transactionId: 2,
          campaignId: 1,
          amount: 20.0,
          level: 1,
          status: CommissionStatus.APPROVED,
          notes: null,
          payoutId: null,
        },
        {
          affiliateId: affiliate.id,
          transactionId: 3,
          campaignId: 1,
          amount: 30.0,
          level: 1,
          status: CommissionStatus.PAID,
          notes: null,
          payoutId: 1,
        },
      ]);
    });

    it('should get total earnings breakdown', async () => {
      const response = await request(app.getHttpServer())
        .get('/affiliate/commissions/earnings')
        .set('Authorization', `Bearer ${affiliateToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('pending');
      expect(response.body.data).toHaveProperty('approved');
      expect(response.body.data).toHaveProperty('paid');
      expect(response.body.data.total).toBe(60.0);
      expect(response.body.data.pending).toBe(10.0);
      expect(response.body.data.approved).toBe(20.0);
      expect(response.body.data.paid).toBe(30.0);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get('/affiliate/commissions/earnings')
        .expect(401);
    });
  });

  describe('GET /affiliate/payouts', () => {
    beforeEach(async () => {
      const payout1 = payoutRepository.create({
        affiliateId: affiliate.id,
        amount: 50.0,
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        paymentDetails: JSON.stringify({ account: '123456' }),
        status: PayoutStatus.PENDING,
        requestedAt: new Date(),
      });

      const payout2 = payoutRepository.create({
        affiliateId: affiliate.id,
        amount: 100.0,
        paymentMethod: PaymentMethod.PAYPAL,
        paymentDetails: JSON.stringify({ email: 'affiliate@example.com' }),
        status: PayoutStatus.PAID,
        requestedAt: new Date(),
        processedAt: new Date(),
        adminNotes: 'Processed',
      });

      await payoutRepository.save([payout1, payout2]);
    });

    it('should get payout history', async () => {
      const response = await request(app.getHttpServer())
        .get('/affiliate/payouts')
        .set('Authorization', `Bearer ${affiliateToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty('amount');
      expect(response.body.data[0]).toHaveProperty('status');
      expect(response.body.data[0]).toHaveProperty('paymentMethod');
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get('/affiliate/payouts')
        .expect(401);
    });

    it('should fail for non-affiliate users', async () => {
      const regResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'regular2@example.com',
          password: 'password123',
        });

      const token = regResponse.body.accessToken;

      await request(app.getHttpServer())
        .get('/affiliate/payouts')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('POST /affiliate/payouts', () => {
    it('should request a payout', async () => {
      const payoutDto = {
        amount: 75.0,
        paymentMethod: 'bank_transfer',
        paymentDetails: {
          bankName: 'Test Bank',
          accountNumber: '123456789',
        },
      };

      const response = await request(app.getHttpServer())
        .post('/affiliate/payouts')
        .set('Authorization', `Bearer ${affiliateToken}`)
        .send(payoutDto)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.amount).toBe(75.0);
      expect(response.body.data.status).toBe(PayoutStatus.PENDING);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .post('/affiliate/payouts')
        .send({
          amount: 50.0,
          paymentMethod: 'bank_transfer',
          paymentDetails: {},
        })
        .expect(401);
    });
  });
});
