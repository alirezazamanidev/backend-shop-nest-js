import { applyDecorators, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { ApiSecurity } from "@nestjs/swagger"
import { SupplierAuthGuard } from "src/modules/supplier/guards/supplier-auth.guard"

export const Auth=()=>{

  return applyDecorators(
    ApiSecurity('Authorization'),
    UseGuards(AuthGuard('jwt'))
  )
}
export const SupplierAuth=()=>{

  return applyDecorators(
    ApiSecurity('Authorization'),
    UseGuards(SupplierAuthGuard)
  )
}
