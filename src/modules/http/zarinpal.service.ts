import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { catchError, lastValueFrom, map } from 'rxjs';

@Injectable()
export class ZarinPalService {
  constructor(private httpService: HttpService) {}

  async sendRequest(data: any) {
    let {amount,description,user}=data
    const options= {
      merchant_id:process.env.ZARINPAL_MERCHANT_ID,
      amount:amount*10,
      description,
      metadata:{
        email:user?.email ?? "exampl@gmail.com",
        mobile:user?.phone ?? "09914275883",
      },
      callback_url:'http://localhost:8000/api/payment/verify',

    }
    const result=await lastValueFrom(
      this.httpService.post(process.env.ZARINPAL_REQUEST_URL,options,{})
      .pipe(map(res=>res.data))
      .pipe(catchError((err)=>{
        console.log(err);
        throw new InternalServerErrorException('zarinpal error')

      }))
    )
    console.log(result.errors);

    const {authority,code}=result.data
    if(code==100 && authority){
      return {
        code,
        authority,
        gateWayUrl:`${process.env.ZARINPAL_GATEWAY_URL}/${authority}`
      }
    }
    throw new BadRequestException('اتصال به زرین پال ناموفق')

  }
  async verifyRequest(data: any) {

    const option= {
      authority:data.authority,
      amount:data.amount*10,
      merchant_id:process.env.ZARINPAL_MERCHANT_ID
    }
    const result=await lastValueFrom(
      this.httpService.post(process.env.ZARINPAL_VERIFY_URL,option,{})
      .pipe(map(res=>res.data))
      .pipe(catchError(err=>{
        console.log(err);

        throw new InternalServerErrorException('zarinpal error')

      }))
    );
    return result;

  }
}
