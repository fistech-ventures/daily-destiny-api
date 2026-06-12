import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const entities = [];
const services = [];
const subscribers = [];

const internalControllers = [];
const webControllers = [];

const modules = [];

@Module({
  imports: [TypeOrmModule.forFeature(entities), ...modules],
  providers: [...services, ...subscribers],
  exports: [...services, ...subscribers],
  controllers: [...internalControllers, ...webControllers],
})
export class CommonModule {}
