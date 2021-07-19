import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  DefaultValuePipe,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';

import { User } from './user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('id') userId?,
    @Query('username') username?,
    @Query('store-id') storeId?,
    @Query('store-name') storeName?,
    @Query('store-exists') storeExists?,
    @Query('is-manager') isManager?,
    @Query('is-active') isActive?,
  ): Promise<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    const options = {
      page,
      limit,
      route: '/v1/users',
    };

    const searchOptions = {
      userId,
      username,
      storeId,
      storeName,
      storeExists,
      isManager,
      isActive,
    };

    return this.usersService.paginate(options, searchOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() userData: CreateUserDto): Promise<User> {
    return this.usersService.create(userData);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() userData: UpdateUserDto) {
    return this.usersService.update(id, userData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
