import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'nestjs-typeorm-paginate';

import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './store.entity';

@Controller('stores')
@UseGuards(AuthGuard('jwt'))
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('store-id') storeId?,
    @Query('store-name') storeName?,
  ): Promise<Pagination<Store>> {
    limit = limit > 100 ? 100 : limit;
    const options = {
      page,
      limit,
      route: '/v1/stores',
    };
    const searchOptions = {
      storeId,
      storeName,
    };

    return this.storesService.paginate(options, searchOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @Post()
  create(@Body() createStoreDto: CreateStoreDto): Promise<Store> {
    return this.storesService.create(createStoreDto).catch((e) => {
      if (/(name)[\s\S]+(already exists)/.test(e.detail)) {
        throw new BadRequestException('Store with this name already exists.');
      }
      return e;
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storesService.update(id, updateStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storesService.remove(id);
  }
}
