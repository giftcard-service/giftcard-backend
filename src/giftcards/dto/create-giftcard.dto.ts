import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

import { Store } from '../../stores/store.entity';

export class CreateGiftcardDto {
  @IsString()
  storeId: Store;

  @IsNumber()
  amount!: number;

  @IsDate()
  creationTime?: Date;

  @IsDate()
  expirationTime!: Date;

  @IsBoolean()
  isUsed?: boolean;
}
