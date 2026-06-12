import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CategoryCreateDTO } from '../dtos/category/create.dto';
import { CategoryUpdateDTO } from '../dtos/category/update.dto';

@Injectable()
export class CategoryService extends BaseService<Category> {
  constructor(
    @InjectRepository(Category)
    private readonly _repo: Repository<Category>,
  ) {
    super(_repo);
  }

  async createOne(payload: CategoryCreateDTO): Promise<Category> {
    const { metaTitle, metaDescription, metaImage, metaKeywords = [], ...data } = payload;
    data['seoMetaData'] = { title: metaTitle, description: metaDescription, image: metaImage, keywords: metaKeywords };
    
    const created = this._repo.create(data);
    return this._repo.save(created);
  }

  async updateOne(id: string, payload: CategoryUpdateDTO): Promise<Category> {
    const { metaTitle, metaDescription, metaImage, metaKeywords = [], ...data } = payload;
    
    if (metaTitle !== undefined || metaDescription !== undefined || metaImage !== undefined || metaKeywords?.length) {
      data['seoMetaData'] = { title: metaTitle, description: metaDescription, image: metaImage, keywords: metaKeywords };
    }
    
    await this._repo.update(id, data);
    return this._repo.findOne({ where: { id } });
  }
}
