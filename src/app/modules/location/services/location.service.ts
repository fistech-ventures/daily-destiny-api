import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { IAuthUser } from '@src/app/interfaces';
import { SuccessResponse } from '@src/app/types';
import { ENUM_LOCATION_TYPE } from '@src/shared/enums/common.enums';
import { Repository, TreeRepository } from 'typeorm';
import { LOCATION_TYPE_HIERARCHY } from '../const';
import { LocationCreateDTO, LocationSeedDTO, LocationUpdateDTO } from '../dtos';
import { Location } from '../entities/location.entity';

@Injectable()
export class LocationService extends BaseService<Location> {
  constructor(
    @InjectRepository(Location)
    private readonly _repo: Repository<Location>,
    @InjectRepository(Location)
    private readonly treeRepo: TreeRepository<Location>,
  ) {
    super(_repo);
  }

  /**
   * Create a single location
   */
  async createOne(payload: LocationCreateDTO, authUser: IAuthUser): Promise<Location> {
    // Validate slug uniqueness
    const existingBySlug = await this._repo.findOne({ where: { slug: payload.slug } });
    if (existingBySlug) {
      throw new BadRequestException(`Location with slug "${payload.slug}" already exists.`);
    }

    // Validate hierarchy
    let parentLocation: Location | null = null;
    if (payload.parentId) {
      parentLocation = await this._repo.findOne({ where: { id: payload.parentId } });
      if (!parentLocation) {
        throw new BadRequestException(`Parent location with ID "${payload.parentId}" not found.`);
      }
      this.validateHierarchy(payload.type, payload.parentId, parentLocation.type);
    } else {
      this.validateHierarchy(payload.type);
    }

    const location = this._repo.create({
      ...payload,
      createdBy: authUser,
    });

    const saved = await this._repo.save(location);
    return this.findByIdBase(saved.id, { relations: { parent: true, children: true } });
  }

  /**
   * Update a location
   */
  async updateOne(id: string, payload: LocationUpdateDTO, authUser: IAuthUser): Promise<Location> {
    const location = await this.isExist({ id } as Location);

    // Validate slug uniqueness if changed
    if (payload.slug && payload.slug !== location.slug) {
      const existingBySlug = await this._repo.findOne({ where: { slug: payload.slug } });
      if (existingBySlug) {
        throw new BadRequestException(`Location with slug "${payload.slug}" already exists.`);
      }
    }

    // Validate hierarchy if type or parentId changes
    const newType = payload.type || location.type;
    const newParentId = payload.parentId !== undefined ? payload.parentId : location.parentId;

    let parentLocation: Location | null = null;
    if (newParentId) {
      parentLocation = await this._repo.findOne({ where: { id: newParentId } });
      if (!parentLocation) {
        throw new BadRequestException(`Parent location with ID "${newParentId}" not found.`);
      }
      // Prevent circular reference
      if (newParentId === id) {
        throw new BadRequestException('A location cannot be its own parent.');
      }
      this.validateHierarchy(newType, newParentId, parentLocation.type);
    } else {
      this.validateHierarchy(newType, undefined, undefined);
    }

    location.updatedBy = authUser;
    Object.assign(location, payload);

    await this._repo.save(location);
    return this.findByIdBase(id, { relations: { parent: true, children: true } });
  }

  /**
   * Get a location with its children
   */
  async getLocationWithChildren(id: string): Promise<Location> {
    const location = await this._repo.findOne({
      where: { id },
      relations: { parent: true, children: true },
    });

    if (!location) {
      throw new BadRequestException(`Location with ID "${id}" not found.`);
    }

    return location;
  }

  /**
   * Get direct children of a location (for cascading dropdowns)
   */
  async getChildren(parentId: string): Promise<Location[]> {
    return this._repo.find({
      where: { parentId, isActive: true },
      order: { position: 'ASC', name: 'ASC' },
    });
  }

  /**
   * Get full nested tree from a starting type
   */
  async getFullTree(type?: ENUM_LOCATION_TYPE): Promise<Location[]> {
    const roots = await this._repo.find({
      where: { type: type || ENUM_LOCATION_TYPE.DIVISION, isActive: true, parentId: null as any },
      order: { position: 'ASC', name: 'ASC' },
    });

    const tree = await Promise.all(
      roots.map(async (root) => {
        return await this.buildTreeRecursive(root);
      }),
    );

    return tree;
  }

  /**
   * Seed locations in bulk
   */
  async seedLocations(payload: LocationSeedDTO, authUser: IAuthUser): Promise<SuccessResponse> {
    const result = {
      inserted: 0,
      skipped: 0,
      errors: [],
    };

    // Map of slug -> saved Location entity for parent resolution
    const locationMap = new Map<string, Location>();

    // ─── Step 1: Ensure virtual root "Bangladesh" exists ───────────────────────
    const rootSlug = 'bangladesh';
    let rootLocation = await this._repo.findOne({ where: { slug: rootSlug } });

    if (!rootLocation) {
      // Check if there are existing root locations (locations without parents)
      const existingRoots = await this._repo.find({ where: { parentId: null } });

      if (existingRoots.length > 0) {
        // Use the first existing root as the virtual root instead of creating a new one
        // This avoids the "multiple root entities" error
        rootLocation = existingRoots[0];
        // Update it to be the Bangladesh root if it's not already
        if (rootLocation.slug !== rootSlug) {
          try {
            rootLocation.name = 'Bangladesh';
            rootLocation.nameBn = 'বাংলাদেশ';
            rootLocation.slug = rootSlug;
            rootLocation.type = ENUM_LOCATION_TYPE.COUNTRY;
            rootLocation.position = 0;
            rootLocation = await this._repo.save(rootLocation);
            result.inserted++; // Count as inserted since we modified it
          } catch (error) {
            result.errors.push(`Error updating existing root to Bangladesh: ${error.message}`);
            return new SuccessResponse('Locations seeded successfully', result);
          }
        }
      } else {
        // No existing roots, create the virtual root
        try {
          const rootEntity = this._repo.create({
            name: 'Bangladesh',
            nameBn: 'বাংলাদেশ',
            slug: rootSlug,
            type: ENUM_LOCATION_TYPE.COUNTRY,
            parent: null,
            position: 0,
            isActive: true,
            createdBy: authUser,
          });
          rootLocation = await this._repo.save(rootEntity);
          result.inserted++;
        } catch (error) {
          result.errors.push(`Error creating virtual root location: ${error.message}`);
          // Cannot continue without root
          return new SuccessResponse('Locations seeded successfully', result);
        }
      }
    }

    locationMap.set(rootSlug, rootLocation);

    // ─── Step 2: Multi-pass processing to handle parent-child dependencies ─────
    const remainingItems = [...payload.locations];
    let processedInPass = true;
    const maxPasses = 10;
    let passCount = 0;

    while (remainingItems.length > 0 && processedInPass && passCount < maxPasses) {
      processedInPass = false;
      passCount++;

      for (let i = remainingItems.length - 1; i >= 0; i--) {
        const item = remainingItems[i];

        try {
          // ── Skip if already exists ──────────────────────────────────────────
          const existing = await this._repo.findOne({ where: { slug: item.slug } });
          if (existing) {
            locationMap.set(item.slug, existing);
            result.skipped++;
            remainingItems.splice(i, 1);
            processedInPass = true;
            continue;
          }

          // ── Guard: circular reference ───────────────────────────────────────
          if (item.parentSlug && item.parentSlug === item.slug) {
            result.errors.push(
              `Location "${item.slug}" has itself as parentSlug. Skipping.`
            );
            remainingItems.splice(i, 1);
            processedInPass = true;
            continue;
          }

          const locationType = item.type as ENUM_LOCATION_TYPE;

          // ── Resolve parent entity object ────────────────────────────────────
          let parentEntity: Location | null = null;

          if (locationType === ENUM_LOCATION_TYPE.DIVISION) {
            // Divisions always hang off the Bangladesh root
            parentEntity = rootLocation;
          } else if (item.parentSlug) {
            // Try in-memory map first (already inserted this session)
            parentEntity = locationMap.get(item.parentSlug) || null;

            // Fall back to DB lookup (already existed before this seed run)
            if (!parentEntity) {
              parentEntity = await this._repo.findOne({
                where: { slug: item.parentSlug },
              });
            }

            // Parent not available yet — defer to next pass
            if (!parentEntity) {
              continue;
            }
          }

          // ── Validate hierarchy rules ────────────────────────────────────────
          try {
            this.validateHierarchy(locationType, parentEntity?.id);
          } catch (validationError) {
            result.errors.push(
              `Hierarchy validation failed for "${item.slug}": ${validationError.message}`
            );
            remainingItems.splice(i, 1);
            processedInPass = true;
            continue;
          }

          // ── Create and save ─────────────────────────────────────────────────
          const location = this._repo.create({
            name: item.name,
            nameBn: item.nameBn ?? null,
            slug: item.slug,
            type: locationType,
            parent: parentEntity,       // ← entity object, NOT parentId string
            position: item.position ?? 0,
            isActive: true,
            createdBy: authUser,
          });

          const saved = await this._repo.save(location);
          locationMap.set(item.slug, saved);
          result.inserted++;
          remainingItems.splice(i, 1);
          processedInPass = true;

        } catch (error) {
          result.errors.push(`Error seeding location "${item.slug}": ${error.message}`);
          remainingItems.splice(i, 1);
          processedInPass = true;
        }
      }
    }

    // ─── Step 3: Report anything that couldn't be resolved ────────────────────
    for (const item of remainingItems) {
      result.errors.push(
        `Could not resolve parentSlug "${item.parentSlug}" for "${item.slug}" after ${maxPasses} passes. Parent may be missing from seed data or DB.`
      );
    }

    return new SuccessResponse('Locations seeded successfully', result);
  }

  /**
   * Soft delete a location
   */
  async softDeleteLocation(id: string): Promise<SuccessResponse> {
    await this.isExist({ id } as Location);

    // Soft delete the location and all its children
    await this._repo.update({ id }, { isActive: false });

    return new SuccessResponse('Location deleted successfully', null);
  }

  /**
   * Find all descendants of a location
   */
  async getDescendants(id: string): Promise<Location[]> {
    const location = await this._repo.findOne({ where: { id } });
    if (!location) {
      throw new BadRequestException(`Location with ID "${id}" not found.`);
    }

    // Use tree repository to get descendants
    const tree = await this.treeRepo.findDescendants(location);
    return tree;
  }

  /**
   * Validate parent-child type hierarchy
   */
  private validateHierarchy(type: ENUM_LOCATION_TYPE, parentId?: string, parentType?: ENUM_LOCATION_TYPE): void {
    const expectedParentType = LOCATION_TYPE_HIERARCHY[type];

    if (expectedParentType === null) {
      // This type should not have a parent (e.g., division)
      if (parentId) {
        throw new BadRequestException(`${type} cannot have a parent location.`);
      }
    } else {
      // This type must have a parent of specific type
      if (!parentId) {
        throw new BadRequestException(`${type} must have a parent location (${expectedParentType}).`);
      }
      if (parentType && parentType !== expectedParentType) {
        throw new BadRequestException(
          `Parent of ${type} must be ${expectedParentType}, but got ${parentType}.`,
        );
      }
    }
  }

  /**
   * Generate slug from name
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  }

  /**
   * Recursively build nested tree
   */
  private async buildTreeRecursive(location: Location): Promise<Location> {
    const children = await this._repo.find({
      where: { parentId: location.id, isActive: true },
      order: { position: 'ASC', name: 'ASC' },
    });

    if (children.length > 0) {
      location.children = await Promise.all(
        children.map((child) => this.buildTreeRecursive(child)),
      );
    }

    return location;
  }
}
