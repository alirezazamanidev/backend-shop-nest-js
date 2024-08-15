import { IUser } from "src/modules/user/interfaces/user-request.interface";

declare global {
    namespace Express {
        interface Request {
            user?:IUser
        }
    }
}