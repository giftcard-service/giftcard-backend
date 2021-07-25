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
import { CreateGiftcardDto } from './dto/create-giftcard.dto';
import { UpdateGiftcardDto } from './dto/update-giftcard.dto';
import { Giftcard } from './giftcard.entity';
import { GiftcardsService } from './giftcards.service';

@Controller('giftcards')
export class GiftcardsController {
  constructor(private readonly giftcardsService: GiftcardsService) {}

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Giftcard))
  @Get()
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
  findOne(@Param('id') id: string): Promise<Giftcard> {
    return this.giftcardsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Giftcard))
  @Post()
  create(@Body() userData: CreateGiftcardDto): Promise<Giftcard> {
    return this.giftcardsService.create(userData);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Giftcard))
  @Patch(':id')
  update(@Param('id') id: string, @Body() userData: UpdateGiftcardDto) {
    return this.giftcardsService.update(id, userData);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Giftcard))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.giftcardsService.remove(id);
  }
}
