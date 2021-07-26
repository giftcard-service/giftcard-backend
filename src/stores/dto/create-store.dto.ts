import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @IsString()
  @ApiProperty()
  name: string;
}
