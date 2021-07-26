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
import { CreateGiftcardPurchaseDto } from './dto/create-giftcard-purchase.dto';
import { UpdateGiftcardPurchaseDto } from './dto/update-giftcard-purchase.dto';
import { GiftcardPurchase } from './giftcard-purchase.entity';
import { GiftcardPurchasesService } from './giftcard-purchases.service';

@Controller('giftcard-purchases')
@ApiTags('상품권 사용 기록 API')
export class GiftcardPurchasesController {
  constructor(
    private readonly giftcardPurchasesService: GiftcardPurchasesService,
  ) {}

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, GiftcardPurchase),
  )
  @Get()
  @ApiOperation({
    summary: '상품권 사용 기록 목록 조회 API',
    description: '상품권 사용 기록 목록을 조회한다.',
  })
  @ApiResponse({
    description: '상품권 사용 기록 목록을 조회한다.',
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
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('user-id') userId?,
    @Query('username') username?,
    @Query('giftcard-id') giftcardId?,
    @Query('store-id') storeId?,
    @Query('store-name') storeName?,
  ): Promise<Pagination<GiftcardPurchase>> {
    limit = limit > 100 ? 100 : limit;
    const options = {
      page,
      limit,
      route: '/v1/giftcard-purchases',
    };

    const searchOptions = {
      userId,
      username,
      giftcardId,
      storeId,
      storeName,
    };

    return this.giftcardPurchasesService.paginate(options, searchOptions);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, GiftcardPurchase),
  )
  @Get(':id')
  @ApiOperation({
    summary: '상품권 사용 기록 조회 API',
    description: '상품권 사용 기록을 조회한다.',
  })
  @ApiResponse({
    description: '상품권 사용 기록을 조회한다.',
  })
  findOne(@Param('id') id: string): Promise<GiftcardPurchase> {
    return this.giftcardPurchasesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, GiftcardPurchase),
  )
  @Post()
  @ApiOperation({
    summary: '상품권 사용 기록 생성 API',
    description: '상품권 사용 기록을 생성한다.',
  })
  @ApiResponse({
    description: '상품권 사용 기록을 생성한다.',
  })
  create(
    @Body() userData: CreateGiftcardPurchaseDto,
  ): Promise<GiftcardPurchase> {
    return this.giftcardPurchasesService.create(userData);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, GiftcardPurchase),
  )
  @Patch(':id')
  @ApiOperation({
    summary: '상품권 사용 기록 수정 API',
    description: '상품권 사용 기록 정보를 수정한다.',
  })
  @ApiResponse({
    description: '상품권 사용 기록 정보를 수정한다.',
  })
  update(@Param('id') id: string, @Body() userData: UpdateGiftcardPurchaseDto) {
    return this.giftcardPurchasesService.update(id, userData);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, GiftcardPurchase),
  )
  @Delete(':id')
  @ApiOperation({
    summary: '상품권 사용 기록 삭제 API',
    description: '상품권 사용 기록을 삭제한다.',
  })
  @ApiResponse({
    description: '상품권 사용 기록을 삭제한다.',
  })
  remove(@Param('id') id: string) {
    return this.giftcardPurchasesService.remove(id);
  }
}
