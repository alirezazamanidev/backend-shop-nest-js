import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountEntity } from './entities/discount.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateDiscountDto } from './dto/discount.dto';
import { ConflictMessage, PublicMessage } from 'src/common/enums/message.enum';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(DiscountEntity)
    private readonly discountRepository: Repository<DiscountEntity>,
  ) {}

  async create(discountDto: CreateDiscountDto) {
    const { amount, code, expires_in, limit, percent } = discountDto;
    await this.checkExistCode(code);
    const discountObject: DeepPartial<DiscountEntity> = { code };

    if ((percent && amount) || (!amount && !percent))
      throw new BadRequestException(
        'باید حتما یک مورد از فیلد های مبلغ یا درصد را وارد کنید!',
      );
      if (amount && !isNaN(parseFloat(amount.toString()))) {
        discountObject["amount"] = amount;
      } else if (percent && !isNaN(parseFloat(percent.toString()))) {
        discountObject["percent"] = percent;
      }

      if (expires_in && !isNaN(parseInt(expires_in.toString()))) {
        const time = 1000 * 60 * 60 * 24 * expires_in;
        discountObject["expires_in"] = new Date(new Date().getTime() + time);
      }
      if (limit && !isNaN(parseInt(limit.toString()))) {
        discountObject["limit"] = limit;
      }


    const discount = this.discountRepository.create(discountObject);
    await this.discountRepository.save(discount);
    return {
      message: PublicMessage.Insert,
    };
  }

  async checkExistCode(code: string) {
    const discount = await this.discountRepository.findOneBy({ code });
    if (discount) throw new ConflictException(ConflictMessage.DisCount);
  }
}
