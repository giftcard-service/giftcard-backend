import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGiftcardPurchaseDto {
  @IsString()
  @ApiProperty()
  userId!: string;

  @IsString()
  @ApiProperty()
  storeId!: string;

  @IsString()
  @ApiProperty()
  giftcardId!: string;

  @IsString()
  @ApiProperty()
  qrCodeId!: string;

  @IsNumber()
  @ApiProperty()
  amount!: number;
}
