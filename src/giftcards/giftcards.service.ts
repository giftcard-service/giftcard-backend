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

@Injectable()
export class GiftcardsService {
  constructor(
    @InjectRepository(Giftcard)
    private giftcardsRepository: Repository<Giftcard>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<Giftcard>> {
    return paginate<Giftcard>(this.giftcardsRepository, options);
  }

  findAll(): Promise<Giftcard[]> {
    return this.giftcardsRepository.find();
  }

  findOne(id: string): Promise<Giftcard> {
    return this.giftcardsRepository.findOne(id);
  }

  findById(id: string): Promise<Giftcard> {
    return this.giftcardsRepository.findOne(id);
  }

  async create(giftcardData: CreateGiftcardDto): Promise<Giftcard> {
    const { ownerId, storeId, creationTime, expirationTime, amount, isUsed } =
      giftcardData;

    const giftcard = new Giftcard();
    giftcard.owner = await this.usersRepository.findOne(ownerId);
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
