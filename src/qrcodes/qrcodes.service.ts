import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

import { QrCode } from './qrcode.entity';
import { CreateQrCodeDto } from './dto/create-qrcode.dto';
import { Giftcard } from '../giftcards/giftcard.entity';

@Injectable()
export class QrCodesService {
  constructor(
    @InjectRepository(QrCode)
    private qrCodesRepository: Repository<QrCode>,
    @InjectRepository(Giftcard)
    private giftcardsRepository: Repository<Giftcard>,
  ) {}

  async paginate(
    options: IPaginationOptions,
    searchOptions: { giftcardId },
  ): Promise<Pagination<QrCode>> {
    const { giftcardId } = searchOptions;

    const queryBuilder = this.qrCodesRepository
      .createQueryBuilder('qrcode')
      .leftJoinAndSelect('qrcode.giftcard', 'giftcard');

    giftcardId &&
      queryBuilder.andWhere('giftcard.id = :giftcardId', { giftcardId });

    const results = await paginate(queryBuilder, options);

    return new Pagination(
      await Promise.all(results.items),
      results.meta,
      results.links,
    );
  }

  findAll(): Promise<QrCode[]> {
    return this.qrCodesRepository.find();
  }

  findOne(id: string): Promise<QrCode> {
    return this.qrCodesRepository.findOne(id);
  }

  findById(id: string): Promise<QrCode> {
    return this.qrCodesRepository.findOne(id);
  }

  findByGiftcardId(giftcardId: string): Promise<QrCode> {
    return this.qrCodesRepository.findOne({
      join: {
        alias: 'qrcode',
        leftJoinAndSelect: {
          giftcard: 'qrcode.giftcard',
        },
      },
      where: {
        giftcard: {
          id: giftcardId,
        },
      },
    });
  }

  async create(qrCodeData: CreateQrCodeDto): Promise<QrCode> {
    const { giftcardId } = qrCodeData;
    const EXPIRY_MINUTES = 1;

    const giftcard = await this.giftcardsRepository.findOne(giftcardId);
    const existingQrCode = await this.qrCodesRepository.findOne({
      where: { giftcard: giftcard },
    });
    if (existingQrCode) {
      await this.qrCodesRepository.remove(existingQrCode);
    }

    const qrCode = new QrCode();
    qrCode.giftcard = giftcard;
    qrCode.expirationTime = new Date(
      new Date().getTime() + EXPIRY_MINUTES * 60000,
    );

    await this.qrCodesRepository.save(qrCode);
    return qrCode;
  }

  async remove(id: string): Promise<void> {
    await this.giftcardsRepository.delete(id);
  }
}
