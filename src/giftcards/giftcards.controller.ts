import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateGiftcardDto } from './dto/create-giftcard.dto';
import { UpdateGiftcardDto } from './dto/update-giftcard.dto';

import { Giftcard } from './giftcard.entity';
import { GiftcardsService } from './giftcards.service';

@Controller('giftcards')
export class GiftcardsController {
  constructor(private readonly giftcardsService: GiftcardsService) {}

  @Get()
  findAll(): Promise<Giftcard[]> {
    return this.giftcardsService.findAll();
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
