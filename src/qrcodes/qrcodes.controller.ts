import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import { CreateQrCodeDto } from './dto/create-qrcode.dto';
import { QrCode } from './qrcode.entity';
import { QrCodesService } from './qrcodes.service';

@Controller('qrcodes')
export class QrCodesController {
  constructor(private readonly qrCodesService: QrCodesService) {}

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, QrCode))
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('giftcard-id') giftcardId?,
  ): Promise<Pagination<QrCode>> {
    limit = limit > 100 ? 100 : limit;
    const options = {
      page,
      limit,
      route: '/v1/qrcodes',
    };

    const searchOptions = {
      giftcardId,
    };

    return this.qrCodesService.paginate(options, searchOptions);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, QrCode))
  @Get(':id')
  findOne(@Param('id') id: string): Promise<QrCode> {
    return this.qrCodesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, QrCode))
  @Post()
  async create(@Body() qrCodeData: CreateQrCodeDto): Promise<QrCode> {
    return await this.qrCodesService.create(qrCodeData);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, QrCode))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.qrCodesService.remove(id);
  }
}
