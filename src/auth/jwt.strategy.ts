import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      /** 토큰 유형 설정 - Bearer 토큰 사용 */
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      /**
       * JWT가 Passport 모듈에 만료되지 않았는지 확인하는 책임을 위임
       * 경로에 만료된 JWT가 제공되면 요청이 거부되고 401 Unauthorized 응답 전송
       */
      ignoreExpiration: false,

      /** 토큰 서명을 위해 대칭 비밀을 제공 */
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
