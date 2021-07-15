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

    await this.usersRepository.save(user);
    user.password = undefined;
    console.log(user);

    return user;
  }

  async update(id: string, userData: UpdateUserDto): Promise<void> {
    const userNew = await this.usersRepository.findOne(id);
    userNew.username = userData.username;
    userNew.password = userData.password;
    await this.usersRepository.save(userNew);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
