import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGiftcardDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  ownerId!: string;

  @IsString()
  @ApiProperty()
  storeId!: string;

  @IsNumber()
  @ApiProperty()
  amount!: number;

  @IsDateString()
  @ApiProperty()
  creationTime?: Date;

  @IsDateString()
  @ApiProperty()
  expirationTime!: Date;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  isUsed?: boolean;
}
