import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetUsersDto {
  @IsString()
  @ApiProperty()
  userId?: string;

  @IsString()
  @ApiProperty()
  username?: string;

  @IsString()
  @ApiProperty()
  storeId?: string;

  @IsString()
  @ApiProperty()
  storeName?: string;

  @IsString()
  @ApiProperty()
  storeExists?: boolean;

  @IsString()
  @ApiProperty()
  isManager?: boolean;

  @IsString()
  @ApiProperty()
  isActive?: boolean;
}
