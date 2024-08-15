import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SendOtpDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { OtpEntity } from '../user/entities/otp.entity';
import { randomInt } from 'crypto';
import { AuthMessage, PublicMessage } from 'src/common/enums/message.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OtpEntity) private otpRepository:Repository<OtpEntity>
  ) {}

  async sendOtp(SendOtpDto: SendOtpDto) {
    let {phone}=SendOtpDto;
    let user=await this.userRepository.findOneBy({phone})
    if(!user){
      user=this.userRepository.create({phone});
      user=await this.userRepository.save(user)
    }
    let otp=await this.createOtpForUser(user.id);

    return {
      message:PublicMessage.SendOtp,
      code:otp.code
    }


  }
  async createOtpForUser(userId: number) {
    let otp = await this.otpRepository.findOneBy({ userId });
    let code = randomInt(10000, 99999).toString();
    let expiresIn = new Date(new Date().getTime() + 2 * 1000 * 60);
    let otpExist = false;
    if (otp) {
      if (otp.expiresIn > new Date())
        throw new UnauthorizedException(AuthMessage.OtpCodeNotExpired);
      otpExist = true;
      otp.code = code;
      otp.expiresIn = expiresIn;
    } else {
      otp = this.otpRepository.create({ userId, code, expiresIn });
    }
    otp = await this.otpRepository.save(otp);
    if (!otpExist)
      await this.userRepository.update({ id: userId }, { otpId: otp.id });
   return otp;
 }
}
