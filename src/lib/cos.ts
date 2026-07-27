import COS from 'cos-nodejs-sdk-v5';
import fs from 'fs';
import 'dotenv/config';

export interface CosConfig {
  SecretId: string;
  SecretKey: string;
  Region: string;
  Bucket: string;
  BucketID: string;
  Domain?: string;
  CdnDomain?: string;
  PathPrefix?: string;
}

export interface CosUploadResult {
  Location: string;
  url: string;
  fileName: string;
}

const getConfig = (): CosConfig => {
  const config: CosConfig = {
    SecretId: process.env.COS_SECRET_ID || '',
    SecretKey: process.env.COS_SECRET_KEY || '',
    Region: process.env.COS_REGION || '',
    Bucket: process.env.COS_BUCKET || '',
    BucketID: process.env.COS_BUCKET_ID || '',
    Domain: process.env.COS_DOMAIN || '',
    CdnDomain: process.env.COS_CDN_DOMAIN || '',
    PathPrefix: process.env.COS_PATH_PREFIX || '',
  };

  if (!config.SecretId || !config.SecretKey || !config.Region || !config.Bucket || !config.BucketID) {
    throw new Error('COS configuration is missing');
  }

  return config;
};

export const cosConfig = getConfig();

export const createCosClient = (): COS => {
  const config = getConfig();

  return new COS({
    SecretId: config.SecretId,
    SecretKey: config.SecretKey,
  });
};

export const generateUploadKey = (originalFileName: string): string => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  const ext = originalFileName.split('.').pop();
  return `${timestamp}_${randomStr}.${ext}`;
};

export const getFileUrl = (key: string): string => {
  const config = getConfig();
  let _tempUrl = key;
  if (config.PathPrefix) {
    _tempUrl = `${config.PathPrefix}/${key}`;
  }
  if (config.CdnDomain) {
    return `https://${config.CdnDomain}/${_tempUrl}`;
  }
  const bucketName = `${config.Bucket}-${config.BucketID}`;
  return `https://${bucketName}.cos.${config.Region}.myqcloud.com/${_tempUrl}`;
};

export const uploadFile = async (
  filePath: string,
  key: string,
): Promise<CosUploadResult> => {
  const cos = createCosClient();
  const config = getConfig();
  const fileBuffer = fs.readFileSync(filePath);

  let _tempUrl = key;
  if (config.PathPrefix) {
    _tempUrl = `${config.PathPrefix}/${key}`;
  }

  const bucketName = `${config.Bucket}-${config.BucketID}`;

  return new Promise<CosUploadResult>((resolve, reject) => {
    cos.putObject({
      Bucket: bucketName,
      Region: config.Region,
      Key: _tempUrl,
      Body: fileBuffer,
    }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          Location: data.Location || '',
          url: getFileUrl(key),
          fileName: key,
        });
      }
    });
  });
};

export const uploadBuffer = async (
  buffer: Buffer,
  key: string,
): Promise<CosUploadResult> => {
  const cos = createCosClient();
  const config = getConfig();

  let _tempUrl = key;
  if (config.PathPrefix) {
    _tempUrl = `${config.PathPrefix}/${key}`;
  }

  const bucketName = `${config.Bucket}-${config.BucketID}`;

  return new Promise<CosUploadResult>((resolve, reject) => {
    cos.putObject({
      Bucket: bucketName,
      Region: config.Region,
      Key: _tempUrl,
      Body: buffer,
    }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          Location: data.Location || '',
          url: getFileUrl(key),
          fileName: key,
        });
      }
    });
  });
};

export const deleteFile = async (key: string): Promise<void> => {
  const cos = createCosClient();
  const config = getConfig();

  let _tempUrl = key;
  if (config.PathPrefix) {
    _tempUrl = `${config.PathPrefix}/${key}`;
  }

  const bucketName = `${config.Bucket}-${config.BucketID}`;

  return new Promise<void>((resolve, reject) => {
    cos.deleteObject({
      Bucket: bucketName,
      Region: config.Region,
      Key: _tempUrl,
    }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};