import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./types/payload.type";

@Injectable()
export class TokenService {

  constructor(private jwtService:JwtService){}

  createJwtToken(payload:JwtPayload){
    return this.jwtService.sign(payload,{
      secret:process.env.JWT_SECRET_KEY,
      expiresIn:"7d"
    })

  }
}
