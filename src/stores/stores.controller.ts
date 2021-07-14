import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Controller('stores')
export class StoresController {
  constructor(private readonly giftcardsService: StoresService) {}

  @Post()
  create(@Body() createGiftcardDto: CreateStoreDto) {
    return this.giftcardsService.create(createGiftcardDto);
  }

  @Get()
  findAll() {
    return this.giftcardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.giftcardsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.giftcardsService.update(id, updateStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.giftcardsService.remove(id);
  }
}
