import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

import { Giftcard } from '../giftcards/giftcard.entity';
import { QrCode } from '../qrcodes/qrcode.entity';
import { Store } from '../stores/store.entity';
import { User } from '../users/user.entity';
import { CreateGiftcardPurchaseDto } from './dto/create-giftcard-purchase.dto';
import { UpdateGiftcardPurchaseDto } from './dto/update-giftcard-purchase.dto';
import { GiftcardPurchase } from './giftcard-purchase.entity';

@Injectable()
export class GiftcardPurchasesService {
  constructor(
    @InjectRepository(GiftcardPurchase)
    private giftcardPurchasesRepository: Repository<GiftcardPurchase>,
    @InjectRepository(Giftcard)
    private giftcardsRepository: Repository<Giftcard>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
    @InjectRepository(QrCode)
    private qrCodesRepository: Repository<QrCode>,
  ) {}

  async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<GiftcardPurchase>> {
    return paginate<GiftcardPurchase>(
      this.giftcardPurchasesRepository,
      options,
    );
  }

  findAll(): Promise<GiftcardPurchase[]> {
    return this.giftcardPurchasesRepository.find();
  }

  findOne(id: string): Promise<GiftcardPurchase> {
    return this.giftcardPurchasesRepository.findOne({ where: { id } });
  }

  findById(id: string): Promise<GiftcardPurchase> {
    return this.giftcardPurchasesRepository.findOne(id);
  }

  async create(
    giftcardPurchaseData: CreateGiftcardPurchaseDto,
  ): Promise<GiftcardPurchase> {
    const { userId, storeId, giftcardId, qrCodeId, amount } =
      giftcardPurchaseData;

    const qrCode = await this.qrCodesRepository.findOne(qrCodeId);
    const today = new Date();

    if (today.getTime() >= qrCode.expirationTime.getTime()) {
      throw new BadRequestException('QR code given has been expired.');
    }

    const giftcardPurchase = new GiftcardPurchase();
    giftcardPurchase.user = await this.usersRepository.findOne(userId);
    giftcardPurchase.store = await this.storesRepository.findOne(storeId);
    giftcardPurchase.giftcard = await this.giftcardsRepository.findOne(
      giftcardId,
    );
    giftcardPurchase.amount = amount;

    await this.giftcardPurchasesRepository.save(giftcardPurchase);
    return giftcardPurchase;
  }

  async update(
    id: string,
    giftcardPurchaseData: UpdateGiftcardPurchaseDto,
  ): Promise<void> {
    const { amount } = giftcardPurchaseData;

    const giftcardPurchase = await this.giftcardPurchasesRepository.findOne(id);
    giftcardPurchase.amount = amount;
    await this.giftcardPurchasesRepository.save(giftcardPurchase);
  }

  async remove(id: string): Promise<void> {
    await this.giftcardPurchasesRepository.delete(id);
  }
}
