import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

import { Store } from '../stores/store.entity';
import { User } from '../users/user.entity';
import { CreateGiftcardDto } from './dto/create-giftcard.dto';
import { UpdateGiftcardDto } from './dto/update-giftcard.dto';
import { Giftcard } from './giftcard.entity';
import { QrCode } from '../qrcodes/qrcode.entity';

@Injectable()
export class GiftcardsService {
  constructor(
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
    searchOptions,
  ): Promise<Pagination<Giftcard>> {
    const {
      userId,
      username,
      storeId,
      storeName,
      expirationStart,
      expirationEnd,
    } = searchOptions;

    const queryBuilder = this.giftcardsRepository
      .createQueryBuilder('giftcard')
      .leftJoinAndSelect('giftcard.owner', 'owner')
      .leftJoinAndSelect('giftcard.store', 'store');

    userId && queryBuilder.andWhere('owner.id = :userId', { userId });
    username &&
      queryBuilder.andWhere('owner.username = :username', { username });
    storeId && queryBuilder.andWhere('store.id = :storeId', { storeId });
    storeName &&
      queryBuilder.andWhere('store.name = :storeName', { storeName });
    expirationStart &&
      queryBuilder.andWhere('giftcard.expirationTime => :expirationStart', {
        expirationStart,
      });
    expirationEnd &&
      queryBuilder.andWhere('giftcard.expirationTime <= :expirationEnd', {
        expirationEnd,
      });

    const results = await paginate(queryBuilder, options);
    return new Pagination(
      await Promise.all(results.items),
      results.meta,
      results.links,
    );
  }

  findAll(): Promise<Giftcard[]> {
    return this.giftcardsRepository.find();
  }

  findOne(id: string): Promise<Giftcard> {
    return this.giftcardsRepository.findOne({ where: { id } });
  }

  findById(id: string): Promise<Giftcard> {
    return this.giftcardsRepository.findOne(id);
  }

  async create(giftcardData: CreateGiftcardDto): Promise<Giftcard> {
    const { ownerId, storeId, creationTime, expirationTime, amount, isUsed } =
      giftcardData;

    const giftcard = new Giftcard();
    if (ownerId) {
      giftcard.owner = await this.usersRepository.findOne(ownerId);
    }
    giftcard.store = await this.storesRepository.findOne(storeId);
    giftcard.creationTime = creationTime;
    giftcard.expirationTime = expirationTime;
    giftcard.amount = amount;

    if (isUsed !== undefined) {
      giftcard.isUsed = isUsed || false;
    }

    await this.giftcardsRepository.save(giftcard);
    return giftcard;
  }

  async update(id: string, giftcardData: UpdateGiftcardDto): Promise<void> {
    const { ownerId, expirationTime, isUsed } = giftcardData;

    const giftcard = await this.giftcardsRepository.findOne(id);
    giftcard.owner = await this.usersRepository.findOne(ownerId);
    giftcard.expirationTime = expirationTime;
    giftcard.isUsed = isUsed;
    await this.giftcardsRepository.save(giftcard);
  }

  async remove(id: string): Promise<void> {
    await this.giftcardsRepository.delete(id);
  }
}
