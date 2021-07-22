import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';

import { CreateGiftcardDto } from './dto/create-giftcard.dto';
import { UpdateGiftcardDto } from './dto/update-giftcard.dto';
import { Giftcard } from './giftcard.entity';
import { GiftcardsService } from './giftcards.service';

@Controller('giftcards')
export class GiftcardsController {
  constructor(private readonly giftcardsService: GiftcardsService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('user-id') userId?,
    @Query('username') username?,
    @Query('store-id') storeId?,
    @Query('store-name') storeName?,
  ): Promise<Pagination<Giftcard>> {
    limit = limit > 100 ? 100 : limit;
    const options = {
      page,
      limit,
      route: '/v1/giftcards',
    };

    const searchOptions = {
      userId,
      username,
      storeId,
      storeName,
    };

    return this.giftcardsService.paginate(options, searchOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Giftcard> {
    return this.giftcardsService.findOne(id);
  }

  @Post()
  create(@Body() userData: CreateGiftcardDto): Promise<Giftcard> {
    return this.giftcardsService.create(userData);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() userData: UpdateGiftcardDto) {
    return this.giftcardsService.update(id, userData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.giftcardsService.remove(id);
  }
}
