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

    if (!(username.length > 4 && username.length < 21)) {
      throw new BadRequestException('Username must be 5 to 20 long.');
    }

    if (!(password.length > 7 && username.length < 17)) {
      throw new BadRequestException('Password must be 8 to 16 long.');
    }

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
    const { username, password, storeId } = userData;

    const user = await this.usersRepository.findOne(id);
    user.username = username;
    user.password = password;

    const store = await this.storesRepository.findOne(userData.storeId);
    if (store) {
      user.store = store;
    }
    await this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async setStore(id: string, store: Store): Promise<void> {
    const user = await this.usersRepository.findOne(id);
    user.store = store;
    await this.usersRepository.save(user);
  }
}
