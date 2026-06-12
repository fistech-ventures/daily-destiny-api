import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@src/app/decorators/publicRoute.decorator';
import { GlobalConfigService } from '../../services/globalConfig.service';

@ApiTags('GlobalConfig')
@Controller('web/global-configs')
export class GlobalConfigWebController {
  constructor(private readonly service: GlobalConfigService) { }

  @Get()
  @Public()
  async find(): Promise<any> {
    return this.service.getConfig("DEFAULT");
  }
}