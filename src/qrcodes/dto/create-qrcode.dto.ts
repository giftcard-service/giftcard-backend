import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQrCodeDto {
  @IsString()
  @ApiProperty()
  giftcardId: string;
}
