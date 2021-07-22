import { IsString } from 'class-validator';

export class CreateQrCodeDto {
  @IsString()
  giftcardId: string;
}
