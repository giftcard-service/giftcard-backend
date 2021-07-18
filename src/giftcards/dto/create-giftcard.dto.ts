import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export class CreateGiftcardDto {
  @IsString()
  ownerId!: string;

  @IsString()
  storeId!: string;

  @IsNumber()
  amount!: number;

  @IsDate()
  creationTime?: Date;

  @IsDate()
  expirationTime!: Date;

  @IsBoolean()
  isUsed?: boolean;
}
