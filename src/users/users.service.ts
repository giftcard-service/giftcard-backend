import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import * as bcrypt from 'bcryptjs';

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

  async paginate(
    options: IPaginationOptions,
    searchOptions,
  ): Promise<Pagination<User>> {
    const {
      userId,
      username,
      storeId,
      storeName,
      storeExists,
      isManager,
      isActive,
    } = searchOptions;

    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.store', 'store');

    isActive !== undefined &&
      queryBuilder.andWhere('user.isActive = :isActive', { isActive });
    isManager !== undefined &&
      queryBuilder.andWhere('user.isManager = :isManager', { isManager });
    userId && queryBuilder.andWhere('user.id = :userId', { userId });
    username &&
      queryBuilder.andWhere('user.username = :username', { username });
    storeName && queryBuilder.andWhere('store.id = :storeId', { storeId });
    storeName &&
      queryBuilder.andWhere('store.name = :storeName', { storeName });

    storeExists !== undefined &&
      storeExists === 'true' &&
      queryBuilder.andWhere('store IS NOT NULL');
    storeExists !== undefined &&
      storeExists === 'false' &&
      queryBuilder.andWhere('store IS NULL');

    const results = await paginate(queryBuilder, options);
    return new Pagination(
      await Promise.all(
        results.items.map(async (item: User) => {
          const store = await this.storesRepository.findOne({
            join: { alias: 'store', innerJoin: { users: 'store.users' } },
            where: (qb) => {
              qb.where('users.id = :userId', { userId: item.id });
            },
          });
          item.store = store || null;
          return item;
        }),
      ),
      results.meta,
      results.links,
    );
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  findOneById(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(userData: CreateUserDto): Promise<User> {
    const { username, password, isManager } = userData;

    if (!(username.length > 4 && username.length < 21)) {
      throw new BadRequestException('Username must be 5 to 20 long.');
    }

    if (!(password.length > 7 && password.length < 17)) {
      throw new BadRequestException('Password must be 8 to 16 long.');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.usersRepository.create({
        username,
        password: hashedPassword,
      });

      /* WARN: Comment this block to disable admin creation via API  */
      if (isManager !== undefined) {
        user.isManager = isManager;
      }

      await this.usersRepository.save(user);
      user.password = undefined;
      return user;
    } catch (e) {
      if (/(username)[\s\S]+(already exists)/.test(e.detail)) {
        throw new BadRequestException(
          'User with this username already exists.',
        );
      } else {
        throw new BadRequestException('Creating user failed.');
      }
    }
  }

  async update(id: string, userData: UpdateUserDto): Promise<User> {
    const { username, password, storeId } = userData;

    const user = await this.usersRepository.findOne(id);

    if (username !== undefined) {
      if (!(username.length > 4 && username.length < 21)) {
        throw new BadRequestException('Username must be 5 to 20 long.');
      }

      user.username = username;
    }
    if (password !== undefined) {
      if (!(password.length > 7 && password.length < 17)) {
        throw new BadRequestException('Password must be 8 to 16 long.');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    if (storeId !== undefined) {
      if (storeId !== null) {
        const store = await this.storesRepository.findOne(userData.storeId);
        if (store) {
          user.store = store;
        }
      } else {
        user.store = null;
      }
    }

    await this.usersRepository.save(user);
    user.password = undefined;
    return user;
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
