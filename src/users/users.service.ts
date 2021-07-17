import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Store } from '../stores/store.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  findOneById(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username: username } });
  }

  async create(userData: CreateUserDto): Promise<User> {
    const { username, password } = userData;

    const user = new User();
    user.username = username;
    user.password = password;

    await this.usersRepository.save(user).catch((e) => {
      if (/(username)[\s\S]+(already exists)/.test(e.detail)) {
        throw new BadRequestException(
          'User with this username already exists.',
        );
      }
      return e;
    });

    user.password = undefined;
    return user;
  }

  async update(id: string, userData: UpdateUserDto): Promise<void> {
    const userNew = await this.usersRepository.findOne(id);
    const store = await this.storesRepository.findOne(userData.storeId);

    userNew.username = userData.username;
    userNew.password = userData.password;
    if (store) {
      userNew.store = store;
    }
    await this.usersRepository.save(userNew);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
