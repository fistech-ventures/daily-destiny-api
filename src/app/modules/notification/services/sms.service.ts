import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ENV } from '@src/env';
import { firstValueFrom } from 'rxjs';
import { ENUM_SMS_GATEWAY_ACCOUNT_TYPE } from '../enums';
import { SmsGatewayService } from './smsGateway.service';

@Injectable()
export class SmsService {
  constructor(
    private readonly http: HttpService,
    private readonly smsGatewayService: SmsGatewayService,
  ) {}

  async sendSmsThroughDefaultGateway(payload: {
    recipient: string;
    message: string;
  }): Promise<any> {
    if (!ENV.isProduction) {
      payload.recipient = '01312784889';
    }
    console.info(
      `🚀 ~ SmsService ~ ~ sendSmsThroughDefaultGateway:========:======== ${payload.recipient} :========:======== ${payload.message} :========:========`,
    );
    try {
      const defaultSmsGateway = await this.smsGatewayService.findOne({
        where: {
          accountType: ENUM_SMS_GATEWAY_ACCOUNT_TYPE.DEFAULT,
          isActive: true,
        },
      });
      if (!defaultSmsGateway) {
        console.info('========= DEFAULT SMS GATEWAY NOT FOUND =========');
      }
      if (defaultSmsGateway.requestMethod === 'GET') {
        const sanitizedSmsGateway = this.smsGatewayService.buildDataWithActualValues(
          defaultSmsGateway,
          payload,
        );

        console.info('========= CALLING SMS GATEWAY =========');
        const responseData = this.http.get(sanitizedSmsGateway.requestEndpoint);

        console.info('========= SMS GATEWAY RESPONDING =========');
        const response = await firstValueFrom(responseData);
        console.info(
          '🚀 ~ SmsService ~ sendSmsThroughDefaultGateway ~ response:',
          response?.data?.status,
        );

        return {
          data: response?.data,
        };
      } else {
        console.error('======== METHOD NOT SUPPORTED FOR THIS GATEWAY ========');
        return;
      }
    } catch (error) {
      console.error('======== ERROR FROM DEFAULT SMS GATEWAY ========', error);
    }
  }
}
