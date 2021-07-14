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

  async create(store: CreateStoreDto): Promise<void> {
    await this.storesRepository.save(store);
  }

  async update(id: string, store: UpdateStoreDto): Promise<void> {
    const storeNew = await this.storesRepository.findOne(id);
    storeNew.name = store.name;
    await this.storesRepository.save(storeNew);
  }

  async remove(id: string): Promise<void> {
    await this.storesRepository.delete(id);
  }
}
