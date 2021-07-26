import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  DefaultValuePipe,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

import { User } from './user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AppAbility } from '../casl/casl-ability.factory';
import { PoliciesGuard } from '../casl/policies.guard';
import { Action } from '../casl/constants';
import { CheckPolicies } from '../casl/utils';

@Controller('users')
@ApiTags('사용자 API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  @Get()
  @ApiOperation({
    summary: '사용자 목록 조회 API',
    description: '사용자 목록을 조회한다.',
  })
  @ApiResponse({
    description: '사용자 목록을 조회한다.',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: '페이지 번호',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: '페이지당 항목 개수',
    required: false,
  })
  @ApiQuery({
    name: 'id',
    type: String,
    description: '사용자 ID',
    required: false,
  })
  @ApiQuery({
    name: 'username',
    type: String,
    description: '사용자 아이디',
    required: false,
  })
  @ApiQuery({
    name: 'store-id',
    type: String,
    description: '매장 ID',
    required: false,
  })
  @ApiQuery({
    name: 'store-name',
    type: String,
    description: '매장 이름',
    required: false,
  })
  @ApiQuery({
    name: 'store-exists',
    type: Boolean,
    description: '매장 보유 여부',
    required: false,
  })
  @ApiQuery({
    name: 'is-manager',
    type: Boolean,
    description: '관리자 여부',
    required: false,
  })
  @ApiQuery({
    name: 'is-active',
    type: Boolean,
    description: '활동 중 여부',
    required: false,
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('id') userId?,
    @Query('username') username?,
    @Query('store-id') storeId?,
    @Query('store-name') storeName?,
    @Query('store-exists') storeExists?,
    @Query('is-manager') isManager?,
    @Query('is-active') isActive?,
  ): Promise<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    const options = {
      page,
      limit,
      route: '/v1/users',
    };

    const searchOptions = {
      userId,
      username,
      storeId,
      storeName,
      storeExists,
      isManager,
      isActive,
    };

    return this.usersService.paginate(options, searchOptions);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  @Get(':id')
  @ApiOperation({
    summary: '사용자 조회 API',
    description: '사용자를 조회한다.',
  })
  @ApiResponse({
    description: '사용자를 조회한다.',
  })
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: '사용자 가입 API',
    description: '사용자를 가입한다.',
  })
  @ApiResponse({
    description: '사용자를 가입한다.',
  })
  create(@Body() userData: CreateUserDto): Promise<User> {
    return this.usersService.create(userData);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, User))
  @Patch(':id')
  @ApiOperation({
    summary: '사용자 수정 API',
    description: '사용자 정보를 수정한다.',
  })
  @ApiResponse({
    description: '사용자 정보를 수정한다.',
  })
  update(@Param('id') id: string, @Body() userData: UpdateUserDto) {
    return this.usersService.update(id, userData);
  }

  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, User))
  @Delete(':id')
  @ApiOperation({
    summary: '사용자 탈퇴 API',
    description: '사용자를 탈퇴한다.',
  })
  @ApiResponse({
    description: '사용자를 탈퇴한다.',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
