import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

import { CreateGiftcardDto } from './create-giftcard.dto';

export class UpdateGiftcardDto extends PartialType(CreateGiftcardDto) {
  @IsString()
  ownerId: string;
}
