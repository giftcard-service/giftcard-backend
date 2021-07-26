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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

import { AppAbility } from '../casl/casl-ability.factory';
import { Action } from '../casl/constants';
import { PoliciesGuard } from '../casl/policies.guard';
import { CheckPolicies } from '../casl/utils';
import { CreateQrCodeDto } from './dto/create-qrcode.dto';
import { QrCode } from './qrcode.entity';
import { QrCodesService } from './qrcodes.service';

@Controller('qrcodes')
@ApiTags('QR 코드 API')
export class QrCodesController {
  constructor(private readonly qrCodesService: QrCodesService) {}

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, QrCode))
  @Get()
  @ApiOperation({
    summary: 'QR 코드 목록 조회 API',
    description: 'QR 코드 목록을 조회한다.',
  })
  @ApiResponse({
    description: 'QR 코드 목록을 조회한다.',
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
    name: 'giftcard-id',
    type: String,
    description: '상품권 ID',
    required: false,
  })
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
  @ApiOperation({
    summary: 'QR 코드 생성 및 조회 API',
    description: 'QR 코드를 새로 생성하면서 조회한다.',
  })
  @ApiResponse({
    description: 'QR 코드를 새로 생성하면서 조회한다.',
  })
  findOne(@Param('id') id: string): Promise<QrCode> {
    return this.qrCodesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, QrCode))
  @Post()
  @ApiOperation({
    summary: 'QR 코드 수정 API',
    description: 'QR 코드 정보를 수정한다.',
  })
  @ApiResponse({
    description: 'QR 코드 정보를 수정한다.',
  })
  async create(@Body() qrCodeData: CreateQrCodeDto): Promise<QrCode> {
    return await this.qrCodesService.create(qrCodeData);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, QrCode))
  @Delete(':id')
  @ApiOperation({
    summary: 'QR 코드 삭제 조회 API',
    description: 'QR 코드를 삭제한다.',
  })
  @ApiResponse({
    description: 'QR 코드를 삭제한다.',
  })
  remove(@Param('id') id: string) {
    return this.qrCodesService.remove(id);
  }
}
