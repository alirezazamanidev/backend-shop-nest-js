export enum ConflictMessage {
  Slug = 'چنین موردی قیلا با این اسلاگ ثبت شده است!',
  Email='ایمیل قبلا ثبت شده است',
  National_code='کد ملی قبلا ثبت شده است',
  Supplier='اکانت فروشنده شما  قبلا ثبت شده است!',
  DisCount='کد تخفیف قبلا ثبت شده است'
}

export enum PublicMessage {
  LoggedIn = 'با موفقیت وارد شدید',
  Insert = 'با موفقیت ایجاد شد!',
  Updated = 'با موفقیت ویرایش شد!',
  SendOtp = 'کد تایید با موفقیت ارسال شد!',
  AddToBasket='با موفقیت به سبد خرید افزوده شده',
  RemoveFromBasket='محصول از سبد خرید حذف شد!'
}
export enum NotFoundMessage {
  Category = 'دسته ای یافت نشد!',
  User = 'کاربری یافت نشد!',
  Payment='پرداخت یافت نشد! ',
  Supplier='اکانت فروشنده شما یافت نشد!',
  Product='کالایی یافت نشد!',
  Basket='محصول در سبد خرید یافت نشد!',
  Order='سقارش یافت نشد!',
  Discount='کد تخفیف یافت نشد!'
}
export enum AuthMessage {
  OtpCodeNotExpired = 'کد تایید هنوز منقضی نشده است!',
  ExpiredOtp = 'کد تایید منقضی شده است لطفا دوباره تلاش کنید!',
  OtpInCurrent = 'کد تایید نادرست است!',
  LoginIsRequired = 'وارد حساب کاربری خود شوید',
  LoginAgain = 'مجددا وارد حساب کاربری خود شوید',

}
