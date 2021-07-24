import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './store.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
  ) {}

  async paginate(
    options: IPaginationOptions,
    searchOptions,
  ): Promise<Pagination<Store>> {
    const { storeId, storeName } = searchOptions;

    const queryBuilder = this.storesRepository.createQueryBuilder('store');

    storeId && queryBuilder.andWhere('store.id = :storeId', { storeId });
    storeName &&
      queryBuilder.andWhere('store.name = :storeName', { storeName });

    return await paginate(queryBuilder, options);
  }

  findAll(): Promise<Store[]> {
    return this.storesRepository.find();
  }

  async findOne(id: string): Promise<Store> {
    const queryBuilder = this.storesRepository
      .createQueryBuilder('store')
      .leftJoin('store.giftcards', 'giftcards')
      .leftJoin('giftcards.giftcardPurchases', 'giftcardPurchases')
      .addSelect(
        `SUM(CASE WHEN giftcards.owner.id IS NULL THEN giftcards.amount ELSE 0 END) `,
        'sumIssuedGiftcardWithNoOwnerAmount',
      )
      .addSelect('SUM(giftcards.amount)', 'sumIssuedGiftcardAmount')
      .addSelect(
        'SUM(giftcards.amount) - SUM(giftcardPurchases.amount)',
        'sumIssuedGiftcardAmountLeft',
      )
      .groupBy('store.id, giftcards.amount')
      .where('store.id = :storeId', { storeId: id });
    const raw_and_entities = await queryBuilder.getRawAndEntities();

    for (const entity of raw_and_entities.entities) {
      const raw = raw_and_entities.raw.find(
        (raw) => raw.store_id === entity.id,
      );
      entity.sumIssuedGiftcardAmount = parseInt(raw.sumIssuedGiftcardAmount);
      entity.sumIssuedGiftcardWithNoOwnerAmount = parseInt(
        raw.sumIssuedGiftcardWithNoOwnerAmount,
      );
      entity.sumIssuedGiftcardAmountLeft = parseInt(
        raw.sumIssuedGiftcardAmountLeft,
      );
    }

    const store = raw_and_entities.entities[0];
    return store;
  }

  findById(id: string): Promise<Store> {
    return this.storesRepository.findOne(id);
  }

  async create(storeData: CreateStoreDto): Promise<Store> {
    const { name } = storeData;

    const store = new Store();
    store.name = name;

    await this.storesRepository.save(store);
    return store;
  }

  async update(id: string, storeData: UpdateStoreDto): Promise<void> {
    const storeNew = await this.storesRepository.findOne(id);
    storeNew.name = storeData.name;
    await this.storesRepository.save(storeNew);
  }

  async remove(id: string): Promise<void> {
    await this.storesRepository.delete(id);
  }
}
