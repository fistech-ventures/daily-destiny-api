import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { Repository } from 'typeorm';
import { PermissionUpsertBulkDTO } from '../dtos';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionService extends BaseService<Permission> {
  constructor(
    @InjectRepository(Permission)
    private readonly _repo: Repository<Permission>,
  ) {
    super(_repo);
  }

  async upsertBulkPermissions(data: PermissionUpsertBulkDTO): Promise<any> {
    const { permissions = [] } = data;

    if (!permissions.length) {
      throw new BadRequestException("No data to sync!");
    }

    // ✅ remove duplicates + trim
    const uniqueTags = Array.from(
      new Set(permissions.map((t: string) => t.trim()).filter(Boolean))
    );

    const payload = uniqueTags.map((title) => ({
      title,
      isActive: true,
    }));

    await this._repo.upsert(payload, ['title']);

    return this.findAllBase({});
  }
}
