export enum ConflictMessage {
  Slug = 'چنین موردی قیلا با این اسلاگ ثبت شده است!',
  Supplier='اکانت فروشنده شما  قبلا ثبت شده است!'
}

export enum PublicMessage {
  LoggedIn = 'با موفقیت وارد شدید',
  Insert = 'با موفقیت ایجاد شد!',
  Updated = 'با موفقیت ویرایش شد!',
  SendOtp = 'کد تایید با موفقیت ارسال شد!',
}
export enum NotFoundMessage {
  Category = 'دسته ای یافت نشد!',
  User = 'کاربری یافت نشد!',
  Supplier='اکانت فروشنده شما یافت نشد!'
}
export enum AuthMessage {
  OtpCodeNotExpired = 'کد تایید هنوز منقضی نشده است!',
  ExpiredOtp = 'کد تایید منقضی شده است لطفا دوباره تلاش کنید!',
  OtpInCurrent = 'کد تایید نادرست است!',
  LoginIsRequired = 'وارد حساب کاربری خود شوید',
  LoginAgain = 'مجددا وارد حساب کاربری خود شوید',

}
