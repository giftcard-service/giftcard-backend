import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

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

  findAll(): Promise<Store[]> {
    return this.storesRepository.find();
  }

  findOne(id: string): Promise<Store> {
    return this.storesRepository.findOne(id);
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
