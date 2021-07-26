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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './store.entity';
import { CheckPolicies } from '../casl/utils';
import { Action } from '../casl/constants';
import { AppAbility } from '../casl/casl-ability.factory';
import { PoliciesGuard } from '../casl/policies.guard';

@Controller('stores')
@ApiTags('매장 API')
@UseGuards(AuthGuard('jwt'))
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  @ApiOperation({
    summary: '매장 목록 조회 API',
    description: '매장 목록을 조회한다.',
  })
  @ApiResponse({
    description: '매장 목록을 조회한다.',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: '페이지 번호',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: '페이지당 항목 개수',
    required: false,
  })
  @ApiQuery({
    name: 'id',
    type: String,
    description: '매장 ID',
    required: false,
  })
  @ApiQuery({
    name: 'name',
    type: String,
    description: '매장 이름',
    required: false,
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('id') storeId?,
    @Query('name') storeName?,
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
  @ApiOperation({
    summary: '매장 조회 API',
    description: '매장을 조회한다.',
  })
  @ApiResponse({
    description: '매장을 조회한다.',
  })
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Store))
  @Post()
  @ApiOperation({
    summary: '매장 생성 API',
    description: '매장을 생성한다.',
  })
  @ApiResponse({
    description: '매장을 생성한다.',
  })
  create(@Body() createStoreDto: CreateStoreDto): Promise<Store> {
    return this.storesService.create(createStoreDto).catch((e) => {
      if (/(name)[\s\S]+(already exists)/.test(e.detail)) {
        throw new BadRequestException('Store with this name already exists.');
      }
      return e;
    });
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Store))
  @Patch(':id')
  @ApiOperation({
    summary: '매장 수정 API',
    description: '매장 정보를 수정한다.',
  })
  @ApiResponse({
    description: '매장 정보를 수정한다.',
  })
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storesService.update(id, updateStoreDto);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Store))
  @Delete(':id')
  @ApiOperation({
    summary: '매장 삭제 API',
    description: '매장을 삭제한다.',
  })
  @ApiResponse({
    description: '매장을 삭제한다.',
  })
  remove(@Param('id') id: string) {
    return this.storesService.remove(id);
  }
}
