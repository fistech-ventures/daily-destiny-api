export interface IGlobalConfigIdentitySocialUrls {
  image?: string,
  facebook?: string,
  instagram?: string,
  youtube?: string,
  tiktok?: string,
}
export interface IGlobalConfigIdentity {
  name?: string,
  description?: string,
  logo?: string,
  icon?: string,
  themePrimaryColor?: string,
  themeSecondayColor?: string,
  email?: string,
  phone?: string,
  address?: string,
  socialUrls?: IGlobalConfigIdentitySocialUrls,
  phoneCode?: string,
  currency?: string,
  initialName?: string,
  needWebView?: boolean,
  allowUserRegistration?: boolean,
  userRegistrationVerificationRequired?: boolean
  otpExpiresInMin?: number,
}