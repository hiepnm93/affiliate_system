import { Test, TestingModule } from '@nestjs/testing';
import { GenerateReferralCodeUseCase } from '../../src/application/affiliate/generate-referral-code.use-case';
import { AFFILIATE_REPOSITORY } from '../../src/domains/affiliate/repositories/affiliate.repository.interface';
import {
  AffiliateEntity,
  AffiliateStatus,
} from '../../src/domains/affiliate/entities/affiliate.entity';

describe('GenerateReferralCodeUseCase', () => {
  let useCase: GenerateReferralCodeUseCase;
  let affiliateRepository: any;

  beforeEach(async () => {
    affiliateRepository = {
      findByUserId: jest.fn(),
      findByReferralCode: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateReferralCodeUseCase,
        {
          provide: AFFILIATE_REPOSITORY,
          useValue: affiliateRepository,
        },
      ],
    }).compile();

    useCase = module.get<GenerateReferralCodeUseCase>(
      GenerateReferralCodeUseCase,
    );
  });

  it('should generate unique referral code for new affiliate', async () => {
    affiliateRepository.findByUserId.mockResolvedValue(null);
    affiliateRepository.findByReferralCode.mockResolvedValue(null);

    const createdAffiliate = new AffiliateEntity(
      1,
      123,
      'ABC12345',
      null,
      1,
      AffiliateStatus.ACTIVE,
      new Date(),
      new Date(),
    );

    affiliateRepository.create.mockResolvedValue(createdAffiliate);

    const result = await useCase.execute(123);

    expect(result).toBeDefined();
    expect(result.referralCode).toHaveLength(8);
    expect(result.userId).toBe(123);
    expect(result.tier).toBe(1);
  });

  it('should return existing affiliate if already exists', async () => {
    const existingAffiliate = new AffiliateEntity(
      1,
      123,
      'EXISTING1',
      null,
      1,
      AffiliateStatus.ACTIVE,
      new Date(),
      new Date(),
    );

    affiliateRepository.findByUserId.mockResolvedValue(existingAffiliate);

    const result = await useCase.execute(123);

    expect(result).toEqual(existingAffiliate);
    expect(affiliateRepository.create).not.toHaveBeenCalled();
  });

  it('should set correct tier for child affiliate', async () => {
    const parentAffiliate = new AffiliateEntity(
      1,
      100,
      'PARENT01',
      null,
      1,
      AffiliateStatus.ACTIVE,
      new Date(),
      new Date(),
    );

    affiliateRepository.findByUserId.mockResolvedValue(null);
    affiliateRepository.findByReferralCode
      .mockResolvedValueOnce(null) // First code generation attempt
      .mockResolvedValueOnce(parentAffiliate); // Parent lookup

    const createdAffiliate = new AffiliateEntity(
      2,
      200,
      'CHILD001',
      1,
      2,
      AffiliateStatus.ACTIVE,
      new Date(),
      new Date(),
    );

    affiliateRepository.create.mockResolvedValue(createdAffiliate);

    const result = await useCase.execute(200, 'PARENT01');

    expect(result.tier).toBe(2);
    expect(result.parentAffiliateId).toBe(1);
  });
});
