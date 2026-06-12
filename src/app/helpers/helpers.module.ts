import { Global, Module } from '@nestjs/common';
import { BcryptHelper } from './bcrypt.helper';
import { EmailHelper } from './email.helper';
import { HtmlHelper } from './html.helper';
import { JWTHelper } from './jwt.helper';

const HELPERS = [BcryptHelper, JWTHelper, EmailHelper, HtmlHelper];

@Global()
@Module({
  providers: [...HELPERS],
  exports: [...HELPERS],
})
export class HelpersModule {}
