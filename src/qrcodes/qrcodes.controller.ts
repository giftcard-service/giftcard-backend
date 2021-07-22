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
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateQrCodeDto } from './dto/create-qrcode.dto';
import { QrCode } from './qrcode.entity';
import { QrCodesService } from './qrcodes.service';

@Controller('qrcodes')
export class QrCodesController {
  constructor(private readonly qrCodesService: QrCodesService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('giftcardId') giftcardId?,
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

  @Get(':id')
  findOne(@Param('id') id: string): Promise<QrCode> {
    return this.qrCodesService.findOne(id);
  }

  @Post()
  async create(@Body() qrCodeData: CreateQrCodeDto): Promise<QrCode> {
    return await this.qrCodesService.create(qrCodeData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.qrCodesService.remove(id);
  }
}
