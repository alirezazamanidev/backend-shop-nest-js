import { IUser } from "src/modules/user/interfaces/user-request.interface";

declare global {
    namespace Express {
        interface Request {
            user?:IUser
        }
    }
}

declare module "express-serve-static-core" {
  export interface Request {
      user?: IUser
  }
}
