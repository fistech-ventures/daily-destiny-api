import { Injectable } from '@nestjs/common';
import { R2UploadHelper } from '@src/app/helpers/r2Upload.helper';
import { IFileMeta } from '@src/app/interfaces';
import { SuccessResponse } from '@src/app/types';
import { ENV } from '@src/env';
import { asyncForEach } from '@src/shared';
import * as fs from 'fs';
import { join } from 'path';

export interface IFileResponse {
  title?: string;
  url: string;
  key?: string;
  mimetype?: string;
  extension?: string;
}

@Injectable()
export class SupabaseFileUploadService {
  constructor(private readonly r2Helper: R2UploadHelper) { }

  async uploadToSupabase(data: { file: IFileMeta; folder?: string }): Promise<IFileResponse> {
    try {
      const { file } = data;
      if (!file) return null;

      const filePath = file.path;
      if (!filePath) return null;

      const extension = filePath.split('.').pop();
      const baseName = file.originalname
        ?.replace(`.${extension}`, '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const fileName = `${baseName}-${Date.now()}.${extension}`;
      let folder = data?.folder;
      if (!folder) {
        folder = this.getFolderByMimeType(file);
      }

      const fileKey = `${ENV.env}/${folder}/${fileName}`;
      const fileBuffer = await fs.promises.readFile(filePath);

      const url = await this.r2Helper.uploadBinary(folder, fileBuffer, fileName, file.mimetype);

      if (url) {
        try {
          await fs.promises.unlink(join(process.cwd(), filePath));
        } catch (error) {
          console.error('🚀 ~ SupabaseFileUploadService ~ uploadToSupabase ~ unlink ~ error:', error);
        }
        return { url, key: fileKey };
      } else {
        console.error('🚀 ~ SupabaseFileUploadService ~ uploadToSupabase ~ url:', url);
        return null;
      }
    } catch (error) {
      console.error('🚀 ~ SupabaseFileUploadService ~ uploadToSupabase ~ error:', error);
      return null;
    }
  }

  async uploadImages(files: IFileMeta[]): Promise<SuccessResponse> {
    const uploaded = [];

    await asyncForEach(files, async (file: IFileMeta, i) => {
      let items = null;

      items = await this.uploadToSupabase({ file });
      if (items) {
        const extension = files[i].path.split('.').pop();
        items.title = files[i]?.originalname?.replace(`.${extension}`, '');
        items.mimetype = files[i]?.mimetype;
        items.extension = extension;
        uploaded.push(items);
      }
    });

    return new SuccessResponse('Uploaded successfully', uploaded);
  }

  async deleteFromSupabase(key: string): Promise<void> {
    try {
      await this.r2Helper.deleteFile(key);
    } catch (error) {
      console.error("🚀 ~ SupabaseFileUploadService ~ deleteFromSupabase ~ error:", error)
    }
  }

  getFolderByMimeType(file: IFileMeta): string {
    if (file?.mimetype) return file?.mimetype?.split('/')[0] + 's';
    return 'assets';
  }
}
