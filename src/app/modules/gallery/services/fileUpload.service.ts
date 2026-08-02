import { Injectable } from '@nestjs/common';
import { R2UploadHelper } from '@src/app/helpers/r2Upload.helper';
import { IFileMeta } from '@src/app/interfaces';
import { SuccessResponse } from '@src/app/types';
import { ENV } from '@src/env';
import { asyncForEach } from '@src/shared';
import axios from 'axios';
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
export class FileUploadService {
  constructor(private readonly r2Helper: R2UploadHelper) { }

  BASE = join(process.cwd(), 'uploads/images');

  async uploadImage(file: IFileMeta): Promise<IFileResponse> {
    const uploaded = await this.uploadToSpace({ file });

    const extension = file.path.split('.').pop();
    uploaded.title = file?.originalname?.replace(`.${extension}`, '');
    uploaded.mimetype = file?.mimetype;
    uploaded.extension = extension;
    return uploaded;
  }

  async uploadImages(files: IFileMeta[]): Promise<SuccessResponse> {
    const uploaded = [];

    await asyncForEach(files, async (file: IFileMeta, i) => {
      let items = null;

      items = await this.uploadToSpace({ file });
      if (items) {
        const extension = files[i].path.split('.').pop();
        items.title = files[i]?.originalname?.replace(`.${extension}`, '');
        items.mimetype = files[i]?.mimetype;
        items.extension = extension;
        uploaded.push(items)
      };
    });

    return new SuccessResponse('Uploaded successfully', uploaded);
  }

  async uploadToSpace(data: { file: IFileMeta; folder?: string }): Promise<IFileResponse> {
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
        .replace(/[^a-z0-9]+/g, '-')   // replace spaces & special chars with "-"
        .replace(/^-+|-+$/g, '');      // remove leading/trailing "-"

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
          console.error('🚀 ~ FileUploadService ~ uploadToSpace ~ unlink ~ error:', error);
        }
        return { url, key: fileKey };
      } else {
        console.error('🚀 ~ FileUploadService ~ uploadToSpace ~ url:', url);
        return null;
      }
    } catch (error) {
      console.error('🚀 ~ FileUploadService ~ uploadToSpace ~ error:', error);
      return null;
    }
  }

  async deleteFromSpace(key: string): Promise<void> {
    await this.r2Helper.deleteFile(key);
  }

  async uploadFacebookProfilePic(imageUrl: string): Promise<string> {
    // Fetch image as stream
    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'arraybuffer',
    });

    // Create unique filename
    const fileName = `${Date.now()}.jpg`;
    const folder = 'profiles';

    const url = await this.r2Helper.uploadBinary(folder, response.data, fileName, 'image/jpeg');
    return url;
  }

  getFolderByMimeType(file: IFileMeta): string {
    if (file?.mimetype) return file?.mimetype?.split('/')[0] + 's';
    return 'assets';
  }
}
