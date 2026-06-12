import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpersModule } from '@src/app/helpers/helpers.module';
import { AclModule } from '../acl/acl.module';
import { GalleryModule } from '../gallery/gallery.module';
import { GlobalConfigModule } from '../globalConfig/globalConfig.module';
import { InternalUserController } from './controllers/internal/user.internal.controller';
import { User } from './entities/user.entity';
import { UserRole } from './entities/userRole.entity';
import { UserService } from './services/user.service';
import { UserRoleService } from './services/userRole.service';
import { UserSubscriber } from './subscribers/user.subscriber';

const entities = [User, UserRole];
const services = [UserService, UserRoleService];
const subscribers = [UserSubscriber];
const internalControllers = [InternalUserController];
const webControllers = [InternalUserController];
const modules = [HelpersModule, AclModule, GlobalConfigModule, GalleryModule];

@Module({
  imports: [TypeOrmModule.forFeature(entities), ...modules],
  providers: [...services, ...subscribers],
  exports: [...services, ...subscribers],
  controllers: [...webControllers, ...internalControllers],
})
export class UserModule {}
