import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';

@Controller()
@ApiTags('앱 API')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({
    summary: '로그인 API',
    description: '로그인한 후 JWT 토큰을 발급받는다.',
  })
  @ApiResponse({
    description: 'JWT 토큰을 발급받는다.',
  })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiOperation({
    summary: '사용자 프로필 조회 API',
    description: '로그인한 사용자 정보를 조회한다.',
  })
  @ApiResponse({
    description: '로그인한 사용자 정보를 조회한다.',
  })
  async getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }
}
