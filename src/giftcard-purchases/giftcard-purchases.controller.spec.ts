import { Test, TestingModule } from '@nestjs/testing';
import { GiftcardPurchasesController } from './giftcard-purchases.controller';

describe('GiftcardPurchasesController', () => {
  let controller: GiftcardPurchasesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GiftcardPurchasesController],
    }).compile();

    controller = module.get<GiftcardPurchasesController>(
      GiftcardPurchasesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
