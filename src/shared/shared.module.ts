import { Module, Global } from '@nestjs/common';

const services = [];

@Global()
@Module({
  providers: services,
  exports: [...services],
})
export class SharedModule {}
