import { Module, Global } from '@nestjs/common';

import { ConfigService } from './config.service';
import { LoggerService } from './logger.service';

const services = [ConfigService, LoggerService];

@Global()
@Module({
  exports: services,
  providers: services,
})
export class SharedModule {}
