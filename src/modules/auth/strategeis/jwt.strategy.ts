import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt, Strategy}  from 'passport-jwt';
import { JwtPayload } from "../types/payload.type";
import { AuthService } from "../auth.service";
@Injectable()
export class JWtStrategy extends PassportStrategy(Strategy){

  constructor(private authService:AuthService){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,

    });
  }
  async validate(payload:JwtPayload){
    const user=await this.authService.validateUserData(payload.userId)
    return user;
  }
}
