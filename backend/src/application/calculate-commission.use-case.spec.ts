import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CalculateCommissionUseCase } from '../../src/application/commission/calculate-commission.use-case';
import { TRANSACTION_REPOSITORY } from '../../src/domains/transaction/repositories/transaction.repository.interface';
import { REFERRED_USER_REPOSITORY } from '../../src/domains/affiliate/repositories/referred-user.repository.interface';
import { AFFILIATE_REPOSITORY } from '../../src/domains/affiliate/repositories/affiliate.repository.interface';
import { CAMPAIGN_REPOSITORY } from '../../src/domains/campaign/repositories/campaign.repository.interface';
import { COMMISSION_REPOSITORY } from '../../src/domains/commission/repositories/commission.repository.interface';
import {
  TransactionEntity,
  TransactionStatus,
} from '../../src/domains/transaction/entities/transaction.entity';
import { ReferredUserEntity } from '../../src/domains/affiliate/entities/referred-user.entity';
import {
  AffiliateEntity,
  AffiliateStatus,
} from '../../src/domains/affiliate/entities/affiliate.entity';
import {
  CampaignEntity,
  RewardType,
  CampaignStatus,
} from '../../src/domains/campaign/entities/campaign.entity';

describe('CalculateCommissionUseCase', () => {
  let useCase: CalculateCommissionUseCase;
  let transactionRepository: any;
  let referredUserRepository: any;
  let affiliateRepository: any;
  let campaignRepository: any;
  let commissionRepository: any;

  beforeEach(async () => {
    // Mock repositories
    transactionRepository = {
      findById: jest.fn(),
    };

    referredUserRepository = {
      findById: jest.fn(),
    };

    affiliateRepository = {
      findParentChain: jest.fn(),
    };

    campaignRepository = {
      findActiveCampaign: jest.fn(),
    };

    commissionRepository = {
      findByTransactionId: jest.fn(),
      bulkCreate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalculateCommissionUseCase,
        {
          provide: TRANSACTION_REPOSITORY,
          useValue: transactionRepository,
        },
        {
          provide: REFERRED_USER_REPOSITORY,
          useValue: referredUserRepository,
        },
        {
          provide: AFFILIATE_REPOSITORY,
          useValue: affiliateRepository,
        },
        {
          provide: CAMPAIGN_REPOSITORY,
          useValue: campaignRepository,
        },
        {
          provide: COMMISSION_REPOSITORY,
          useValue: commissionRepository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue: any) => {
              if (key === 'MAX_AFFILIATE_LEVELS') return 5;
              return defaultValue;
            }),
          },
        },
      ],
    }).compile();

    useCase = module.get<CalculateCommissionUseCase>(
      CalculateCommissionUseCase,
    );
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should calculate multi-level commissions correctly', async () => {
    // Mock data
    const transaction = new TransactionEntity(
      1,
      10,
      1000,
      'USD',
      TransactionStatus.COMPLETED,
      'ext_123',
      {},
      new Date(),
      new Date(),
    );

    const referredUser = new ReferredUserEntity(
      10,
      'customer@example.com',
      100,
      'ABC123',
      1,
      'cookie123',
      new Date(),
      new Date(),
    );

    const affiliate1 = new AffiliateEntity(
      1,
      1,
      'ABC123',
      null,
      1,
      AffiliateStatus.ACTIVE,
      new Date(),
      new Date(),
    );

    const affiliate2 = new AffiliateEntity(
      2,
      2,
      'DEF456',
      1,
      2,
      AffiliateStatus.ACTIVE,
      new Date(),
      new Date(),
    );

    const affiliate3 = new AffiliateEntity(
      3,
      3,
      'GHI789',
      2,
      3,
      AffiliateStatus.ACTIVE,
      new Date(),
      new Date(),
    );

    const campaign = new CampaignEntity(
      1,
      'Test Campaign',
      new Date('2024-01-01'),
      new Date('2025-12-31'),
      RewardType.PERCENTAGE,
      10,
      { 1: 10, 2: 5, 3: 2 },
      30,
      CampaignStatus.ACTIVE,
      new Date(),
      new Date(),
    );

    // Setup mocks
    transactionRepository.findById.mockResolvedValue(transaction);
    referredUserRepository.findById.mockResolvedValue(referredUser);
    affiliateRepository.findParentChain.mockResolvedValue([
      affiliate1,
      affiliate2,
      affiliate3,
    ]);
    campaignRepository.findActiveCampaign.mockResolvedValue(campaign);
    commissionRepository.findByTransactionId.mockResolvedValue([]);
    commissionRepository.bulkCreate.mockImplementation(
      (commissions) => commissions,
    );

    // Execute
    const result = await useCase.execute(1);

    // Assert
    expect(result).toHaveLength(3);
    expect(result[0].amount).toBe(100); // 10% of 1000
    expect(result[0].level).toBe(1);
    expect(result[0].affiliateId).toBe(1);

    expect(result[1].amount).toBe(50); // 5% of 1000
    expect(result[1].level).toBe(2);
    expect(result[1].affiliateId).toBe(2);

    expect(result[2].amount).toBe(20); // 2% of 1000
    expect(result[2].level).toBe(3);
    expect(result[2].affiliateId).toBe(3);
  });

  it('should return empty array when no active campaign', async () => {
    const transaction = new TransactionEntity(
      1,
      10,
      1000,
      'USD',
      TransactionStatus.COMPLETED,
      'ext_123',
      {},
      new Date(),
      new Date(),
    );

    const referredUser = new ReferredUserEntity(
      10,
      'customer@example.com',
      100,
      'ABC123',
      1,
      'cookie123',
      new Date(),
      new Date(),
    );

    transactionRepository.findById.mockResolvedValue(transaction);
    referredUserRepository.findById.mockResolvedValue(referredUser);
    campaignRepository.findActiveCampaign.mockResolvedValue(null);
    commissionRepository.findByTransactionId.mockResolvedValue([]);

    const result = await useCase.execute(1);

    expect(result).toEqual([]);
  });

  it('should return existing commissions if already calculated', async () => {
    const existingCommissions = [
      { id: 1, amount: 100, level: 1 },
      { id: 2, amount: 50, level: 2 },
    ];

    commissionRepository.findByTransactionId.mockResolvedValue(
      existingCommissions,
    );

    const result = await useCase.execute(1);

    expect(result).toEqual(existingCommissions);
    expect(transactionRepository.findById).not.toHaveBeenCalled();
  });
});
