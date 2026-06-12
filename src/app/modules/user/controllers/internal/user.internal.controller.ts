import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilterRoleDTO } from '@src/app/modules/acl/dtos';
import { Role } from '@src/app/modules/acl/entities/role.entity';
import { SuccessResponse } from '@src/app/types';
import { ENUM_ACL_DEFAULT_ROLES } from '@src/shared';
import { FindOptionsRelations, In, Not } from 'typeorm';
import { CreateUserDTO, FilterUserDTO, UpdateUserDTO } from '../../dtos';
import { User } from '../../entities/user.entity';
import { UserService } from '../../services/user.service';

@ApiTags('User')
@ApiBearerAuth()
@Controller('internal/users')
export class InternalUserController {
  // RELATIONS = ['userRoles', 'userRoles.role'];
  constructor(private readonly service: UserService) { }

  RELATIONS: FindOptionsRelations<User> = {
    userRoles: {
      role: true,
    },
  };

  @Get()
  async findAll(@Query() query: FilterUserDTO): Promise<SuccessResponse<User[]>> {
    // query['userRoles'] = { role: { title: Not(In([ENUM_ACL_DEFAULT_ROLES.SUPER_ADMIN])) } };
    query['email'] = Not(In(['aamaruf131@gmail.com', 'career.jahid@gmail.com', 'superadmin@theprimetv.com']));
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Get(':id/available-roles')
  async availableRoles(@Param('id') id: string, @Query() query: FilterRoleDTO): Promise<Role[]> {
    return this.service.availableRoles(id, query);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<User> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }

  @Post()
  async createOne(@Body() body: CreateUserDTO): Promise<User> {
    body.roles.push(ENUM_ACL_DEFAULT_ROLES.PUBLIC);
    body.roles.push(ENUM_ACL_DEFAULT_ROLES.INTERNAL);
    body.roles = [...new Set(body.roles)];
    body['isVerified'] = true;
    return this.service.createUser(body, this.RELATIONS);
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() body: UpdateUserDTO): Promise<User> {
    return this.service.updateUser(id, body, this.RELATIONS);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string | string): Promise<SuccessResponse> {
    return this.service.deleteOneBase(id as any);
  }
}
