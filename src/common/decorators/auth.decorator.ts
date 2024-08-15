import { applyDecorators, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { ApiSecurity } from "@nestjs/swagger"

export const Auth=()=>{

  return applyDecorators(
    ApiSecurity('Authorization'),
    UseGuards(AuthGuard('jwt'))
  )
}
