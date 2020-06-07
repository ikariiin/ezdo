import { join } from 'path';
import { promises as fs, existsSync } from 'fs';
import { uniqueNamesGenerator, colors, animals, adjectives } from 'unique-names-generator';
import { Request } from 'express';
import { DiskStorageOptions } from 'multer'

export function destination(request: Request, file: Express.Multer.File, cb: Function) {
  cb(null, process.env.IMAGE_STORE_FS);
}

export function filename(request: Request, file: Express.Multer.File, cb: Function) {
  const fileExt = file.originalname.split('.').pop();
  request.imageStoreName = `${uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    length: 3
  })}.${fileExt}`;
  cb(null, request.imageStoreName);
}