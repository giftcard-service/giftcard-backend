import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Store } from '../stores/store.entity';
import { User } from '../users/user.entity';
import { Giftcard } from './giftcard.entity';
import { GiftcardsController } from './giftcards.controller';
import { GiftcardsService } from './giftcards.service';
import { GiftcardPurchase } from '../giftcard-purchases/giftcard-purchase.entity';
import { QrCode } from '../qrcodes/qrcode.entity';
import { CaslModule } from '../casl/casl.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Store, Giftcard, GiftcardPurchase, QrCode]),
    CaslModule,
  ],
  exports: [GiftcardsService],
  providers: [GiftcardsService],
  controllers: [GiftcardsController],
})
export class GiftcardsModule {}
