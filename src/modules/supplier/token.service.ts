import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/payload.type';
import { AuthMessage } from 'src/common/enums/message.enum';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  createJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '7d',
    });
  }
  verifyJWT(token: string):JwtPayload {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
    } catch (error) {
      throw new UnauthorizedException(AuthMessage.LoginAgain);
    }
  }
}
