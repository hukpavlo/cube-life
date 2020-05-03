import { Module, Global } from '@nestjs/common';

import { ConfigService } from './services/config.service';

const services = [ConfigService];

@Global()
@Module({
  exports: services,
  providers: services,
})
export class SharedModule {}
