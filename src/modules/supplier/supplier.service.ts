import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupplierSignupDto } from './dto/supplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { Repository } from 'typeorm';
import { SupplierOtpEntity } from './entities/otp.entity';
import {
  AuthMessage,
  ConflictMessage,
  PublicMessage,
} from 'src/common/enums/message.enum';
import { CategoryService } from '../category/category.service';
import { randomInt } from 'crypto';
import { CheckOtpDto } from '../auth/dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity)
    private readonly supplierRepository: Repository<SupplierEntity>,
    @InjectRepository(SupplierOtpEntity)
    private readonly supplierOtpRepository: Repository<SupplierOtpEntity>,
    private readonly categoryService: CategoryService,
    private tokenService: TokenService,
  ) {}

  async sginup(signupDto: SupplierSignupDto) {
    const { categoryId, city, manager_fullname, phone, store_name } = signupDto;
    const supplier = await this.supplierRepository.findOneBy({ phone });
    if (supplier) throw new ConflictException(ConflictMessage.Supplier);
    await this.categoryService.findOneById(categoryId);
    let account = this.supplierRepository.create({
      manager_fullname,
      phone,
      categoryId,
      city,
      store_name,
    });
    account = await this.supplierRepository.save(account);
    let otp = await this.createOtpForSupplier(account.id);
    return {
      message: PublicMessage.SendOtp,
      code: otp.code,
    };
  }

  async checkOtp(CheckOtpDto: CheckOtpDto) {
    let { phone, code } = CheckOtpDto;
    const supplier = await this.supplierRepository.findOne({
      where: { phone },
      relations: { otp: true },
    });

    if (!supplier) throw new UnauthorizedException(AuthMessage.LoginAgain);
    let otp = supplier?.otp;
    if (!otp) throw new UnauthorizedException(AuthMessage.OtpInCurrent);
    if (otp.code !== code)
      throw new UnauthorizedException(AuthMessage.OtpInCurrent);
    if (otp.expiresIn < new Date())
      throw new UnauthorizedException(AuthMessage.ExpiredOtp);
    if (!supplier.phone_verify)
      await this.supplierRepository.update(
        { id: supplier.id },
        { phone_verify: true },
      );
    const token = await this.tokenService.createJwtToken({
      supplierId: supplier.id,
    });

    return {
      message: PublicMessage.LoggedIn,
      token,
    };
  }

  async createOtpForSupplier(supplierId: number) {
    let otp = await this.supplierOtpRepository.findOneBy({ supplierId });
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
      otp = this.supplierOtpRepository.create({ supplierId, code, expiresIn });
    }
    otp = await this.supplierOtpRepository.save(otp);
    if (!otpExist)
      await this.supplierRepository.update(
        { id: supplierId },
        { otpId: otp.id },
      );
    return otp;
  }
}
