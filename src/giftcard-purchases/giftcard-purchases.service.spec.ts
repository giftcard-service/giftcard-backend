import { Test, TestingModule } from '@nestjs/testing';
import { GiftcardPurchasesService } from './giftcard-purchases.service';

describe('GiftcardPurchasesService', () => {
  let service: GiftcardPurchasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GiftcardPurchasesService],
    }).compile();

    service = module.get<GiftcardPurchasesService>(GiftcardPurchasesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
