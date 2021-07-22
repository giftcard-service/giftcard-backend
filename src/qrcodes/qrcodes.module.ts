import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Giftcard } from '../giftcards/giftcard.entity';
import { QrCode } from './qrcode.entity';
import { QrCodesController } from './qrcodes.controller';
import { QrCodesService } from './qrcodes.service';

@Module({
  imports: [TypeOrmModule.forFeature([QrCode, Giftcard])],
  exports: [QrCodesService],
  controllers: [QrCodesController],
  providers: [QrCodesService],
})
export class QrcodesModule {}
