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

import { AppAbility } from '../casl/casl-ability.factory';
import { Action } from '../casl/constants';
import { PoliciesGuard } from '../casl/policies.guard';
import { CheckPolicies } from '../casl/utils';
import { CreateGiftcardPurchaseDto } from './dto/create-giftcard-purchase.dto';
import { UpdateGiftcardPurchaseDto } from './dto/update-giftcard-purchase.dto';
import { GiftcardPurchase } from './giftcard-purchase.entity';
import { GiftcardPurchasesService } from './giftcard-purchases.service';

@Controller('giftcard-purchases')
export class GiftcardPurchasesController {
  constructor(
    private readonly giftcardPurchasesService: GiftcardPurchasesService,
  ) {}

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, GiftcardPurchase),
  )
  @Get()
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
  findOne(@Param('id') id: string): Promise<GiftcardPurchase> {
    return this.giftcardPurchasesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, GiftcardPurchase),
  )
  @Post()
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
  update(@Param('id') id: string, @Body() userData: UpdateGiftcardPurchaseDto) {
    return this.giftcardPurchasesService.update(id, userData);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, GiftcardPurchase),
  )
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.giftcardPurchasesService.remove(id);
  }
}
