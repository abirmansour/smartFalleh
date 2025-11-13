import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TokenBlacklistService } from './token-blacklist.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private tokenBlacklistService: TokenBlacklistService,
  ) {
    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default_secret',
    };
    super(options);
  }

  async validate(payload: any) {
    const tokenId = payload.sub;
    const isBlacklisted = this.tokenBlacklistService.isBlacklisted(tokenId);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token is blacklisted');
    }

    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
