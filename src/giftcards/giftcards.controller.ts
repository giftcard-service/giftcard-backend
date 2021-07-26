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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

import { AppAbility } from '../casl/casl-ability.factory';
import { Action } from '../casl/constants';
import { PoliciesGuard } from '../casl/policies.guard';
import { CheckPolicies } from '../casl/utils';
import { CreateGiftcardDto } from './dto/create-giftcard.dto';
import { UpdateGiftcardDto } from './dto/update-giftcard.dto';
import { Giftcard } from './giftcard.entity';
import { GiftcardsService } from './giftcards.service';

@Controller('giftcards')
@ApiTags('상품권 API')
export class GiftcardsController {
  constructor(private readonly giftcardsService: GiftcardsService) {}

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Giftcard))
  @Get()
  @ApiOperation({
    summary: '상품권 목록 조회 API',
    description: '상품권 목록을 조회한다.',
  })
  @ApiResponse({
    description: '상품권 목록을 조회한다.',
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
    name: 'user-id',
    type: String,
    description: '사용자 ID',
    required: false,
  })
  @ApiQuery({
    name: 'username',
    type: String,
    description: '사용자 아이디',
    required: false,
  })
  @ApiQuery({
    name: 'store-id',
    type: String,
    description: '매장 ID',
    required: false,
  })
  @ApiQuery({
    name: 'store-name',
    type: String,
    description: '매장 이름',
    required: false,
  })
  @ApiQuery({
    name: 'exp-start',
    type: Date,
    description: '만료 시각 시작 필터링',
    required: false,
  })
  @ApiQuery({
    name: 'exp-end',
    type: Date,
    description: '만료 시각 종료 필터링',
    required: false,
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('user-id') userId?,
    @Query('username') username?,
    @Query('store-id') storeId?,
    @Query('store-name') storeName?,
    @Query('exp-start') expirationStart?,
    @Query('exp-end') expirationEnd?,
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
      expirationStart,
      expirationEnd,
    };

    return this.giftcardsService.paginate(options, searchOptions);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Giftcard))
  @Get(':id')
  @ApiOperation({
    summary: '상품권 조회 API',
    description: '상품권을 조회한다.',
  })
  @ApiResponse({
    description: '상품권을 조회한다.',
  })
  findOne(@Param('id') id: string): Promise<Giftcard> {
    return this.giftcardsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Giftcard))
  @Post()
  @ApiOperation({
    summary: '상품권 생성 API',
    description: '상품권을 생성한다.',
  })
  @ApiResponse({
    description: '상품권을 생성한다.',
  })
  create(@Body() userData: CreateGiftcardDto): Promise<Giftcard> {
    return this.giftcardsService.create(userData);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Giftcard))
  @Patch(':id')
  @ApiOperation({
    summary: '상품권 수정 API',
    description: '상품권 정보를 수정한다.',
  })
  @ApiResponse({
    description: '상품권 정보를 수정한다.',
  })
  update(@Param('id') id: string, @Body() userData: UpdateGiftcardDto) {
    return this.giftcardsService.update(id, userData);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Giftcard))
  @Delete(':id')
  @ApiOperation({
    summary: '상품권 삭제 API',
    description: '상품권을 삭제한다.',
  })
  @ApiResponse({
    description: '상품권을 삭제한다.',
  })
  remove(@Param('id') id: string) {
    return this.giftcardsService.remove(id);
  }
}
