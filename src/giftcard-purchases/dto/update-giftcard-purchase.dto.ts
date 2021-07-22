import { PartialType } from '@nestjs/mapped-types';

import { CreateGiftcardPurchaseDto } from './create-giftcard-purchase.dto';

export class UpdateGiftcardPurchaseDto extends PartialType(
  CreateGiftcardPurchaseDto,
) {}
