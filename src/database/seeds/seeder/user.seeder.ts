import { BcryptHelper } from '@src/app/helpers';
import { Role } from '@src/app/modules/acl/entities/role.entity';
import { User } from '@src/app/modules/user/entities/user.entity';
import { UserRole } from '@src/app/modules/user/entities/userRole.entity';
import { ENV } from '@src/env';
import { ENUM_ACL_DEFAULT_ROLES, ENUM_AUTH_PROVIDERS } from '@src/shared';
import { DataSource } from 'typeorm';

export default class UserSeeder {
  constructor(private readonly dataSource: DataSource) { }

  public async run(): Promise<void> {
    const isSuperAdminExist = await this.dataSource.manager.findOne(User, {
      where: [{ email: ENV.seedData.superAdminEmail }, { username: 'superadmin' }],
    });

    if (!isSuperAdminExist) {
      const bcryptHelper = new BcryptHelper();

      const password = await bcryptHelper.hash(ENV.seedData.superAdminPassword);

      const createdAdminUser = await this.dataSource.manager.save(User, {
        email: ENV.seedData.superAdminEmail,
        username: 'superadmin',
        fullName: 'Super Admin',
        password,
        authProvider: ENUM_AUTH_PROVIDERS.SYSTEM,
        isVerified: true,
      } satisfies User);

      let superAdminRole = await this.dataSource.manager.findOne(Role, {
        where: {
          title: ENUM_ACL_DEFAULT_ROLES.SUPER_ADMIN,
        },
      });
      if (!superAdminRole) {
        superAdminRole = await this.dataSource.manager.save(Role, {
          title: ENUM_ACL_DEFAULT_ROLES.SUPER_ADMIN,
        } satisfies Role);
      }
      let internalRole = await this.dataSource.manager.findOne(Role, {
        where: {
          title: ENUM_ACL_DEFAULT_ROLES.INTERNAL,
        },
      });
      if (!internalRole) {
        internalRole = await this.dataSource.manager.save(Role, {
          title: ENUM_ACL_DEFAULT_ROLES.INTERNAL,
        } satisfies Role);
      }
      let publicRole = await this.dataSource.manager.findOne(Role, {
        where: {
          title: ENUM_ACL_DEFAULT_ROLES.PUBLIC,
        },
      });
      if (!publicRole) {
        publicRole = await this.dataSource.manager.save(Role, {
          title: ENUM_ACL_DEFAULT_ROLES.PUBLIC,
        } satisfies Role);
      }
      await this.dataSource.manager.save(UserRole, [
        {
          roleId: superAdminRole.id,
          userId: createdAdminUser?.id,
          isDefault: true,
        } satisfies UserRole,
        {
          roleId: internalRole.id,
          userId: createdAdminUser?.id,
          isDefault: true,
        } satisfies UserRole,
        {
          roleId: publicRole.id,
          userId: createdAdminUser?.id,
          isDefault: true,
        } satisfies UserRole,
      ]);
    }
    if (!ENV.isProduction) {
      const isSuperDevExist = await this.dataSource.manager.findOne(User, {
        where: { email: 'quicksoftd@gmail.com' },
      });

      if (!isSuperDevExist) {
        const bcryptHelper = new BcryptHelper();

        const password = await bcryptHelper.hash('12345678');

        const createdSuperDevUser = await this.dataSource.manager.save(User, {
          email: 'quicksoftd@gmail.com',
          username: 'superdev',
          fullName: 'Super Dev',
          password,
          authProvider: ENUM_AUTH_PROVIDERS.SYSTEM,
          isVerified: true,
        } satisfies User);

        let superAdminRole = await this.dataSource.manager.findOne(Role, {
          where: {
            title: ENUM_ACL_DEFAULT_ROLES.SUPER_ADMIN,
          },
        });
        if (!superAdminRole) {
          superAdminRole = await this.dataSource.manager.save(Role, {
            title: ENUM_ACL_DEFAULT_ROLES.SUPER_ADMIN,
          } satisfies Role);
        }
        let internalRole = await this.dataSource.manager.findOne(Role, {
          where: {
            title: ENUM_ACL_DEFAULT_ROLES.INTERNAL,
          },
        });
        if (!internalRole) {
          internalRole = await this.dataSource.manager.save(Role, {
            title: ENUM_ACL_DEFAULT_ROLES.INTERNAL,
          } satisfies Role);
        }
        let publicRole = await this.dataSource.manager.findOne(Role, {
          where: {
            title: ENUM_ACL_DEFAULT_ROLES.PUBLIC,
          },
        });
        if (!publicRole) {
          publicRole = await this.dataSource.manager.save(Role, {
            title: ENUM_ACL_DEFAULT_ROLES.PUBLIC,
          } satisfies Role);
        }
        await this.dataSource.manager.save(UserRole, [
          {
            roleId: superAdminRole.id,
            userId: createdSuperDevUser?.id,
            isDefault: true,
          } satisfies UserRole,
          {
            roleId: internalRole.id,
            userId: createdSuperDevUser?.id,
            isDefault: true,
          } satisfies UserRole,
          {
            roleId: publicRole.id,
            userId: createdSuperDevUser?.id,
            isDefault: true,
          } satisfies UserRole,
        ]);
      }
    }
  }
}
