import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  findById(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async create(store: CreateUserDto): Promise<void> {
    await this.usersRepository.save(store);
  }

  async update(id: string, store: UpdateUserDto): Promise<void> {
    const userNew = await this.usersRepository.findOne(id);
    userNew.username = store.username;
    userNew.password = store.password;
    await this.usersRepository.save(userNew);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
