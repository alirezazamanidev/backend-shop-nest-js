import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { JWtStrategy } from './strategeis/jwt.strategy';

@Module({
  imports:[UserModule,JwtModule.register({global:true})],
  controllers: [AuthController],
  providers: [AuthService,TokenService,JWtStrategy],
})
export class AuthModule {}
