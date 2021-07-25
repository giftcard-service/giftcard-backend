import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Giftcard } from '../giftcards/giftcard.entity';
import { GiftcardPurchase } from './giftcard-purchase.entity';
import { GiftcardPurchasesController } from './giftcard-purchases.controller';
import { GiftcardPurchasesService } from './giftcard-purchases.service';
import { QrCode } from '../qrcodes/qrcode.entity';
import { Store } from '../stores/store.entity';
import { User } from '../users/user.entity';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Giftcard, GiftcardPurchase, User, Store, QrCode]),
    CaslModule,
  ],
  controllers: [GiftcardPurchasesController],
  providers: [GiftcardPurchasesService],
})
export class GiftcardPurchasesModule {}
