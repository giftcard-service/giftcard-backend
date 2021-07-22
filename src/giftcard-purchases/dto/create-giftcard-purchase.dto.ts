import { IsNumber, IsString } from 'class-validator';

export class CreateGiftcardPurchaseDto {
  @IsString()
  userId!: string;

  @IsString()
  storeId!: string;

  @IsString()
  giftcardId!: string;

  @IsString()
  qrCodeId!: string;

  @IsNumber()
  amount!: number;
}
