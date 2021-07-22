import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateGiftcardDto {
  @IsString()
  @IsOptional()
  ownerId!: string;

  @IsString()
  storeId!: string;

  @IsNumber()
  amount!: number;

  @IsDateString()
  creationTime?: Date;

  @IsDateString()
  expirationTime!: Date;

  @IsBoolean()
  @IsOptional()
  isUsed?: boolean;
}
