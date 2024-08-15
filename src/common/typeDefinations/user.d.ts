import { ISupplier } from "src/modules/supplier/interfaces/supplier-request.interface";
import { IUser } from "src/modules/user/interfaces/user-request.interface";

declare global {
    namespace Express {
        interface Request {
            user?:IUser
            supplier?:ISupplier
        }
    }
}

declare module "express-serve-static-core" {
  export interface Request {
      user?: IUser
  }
}
