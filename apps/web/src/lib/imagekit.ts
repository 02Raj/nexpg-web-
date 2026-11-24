import crypto from 'node:crypto';

export type ImageKitUploadResult = {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height?: number;
  width?: number;
  size: number;
};

export async function uploadToImageKit(options: {
  file: string; // base64 string or data URI
  fileName: string;
  folder?: string;
  useUniqueFileName?: boolean;
}): Promise<ImageKitUploadResult> {
  const privateKey =
    process.env.IMAGEKIT_PRIVATE_KEY?.trim() ||
    'private_PkrMol0KgxOnMemwf5oyb2DwMSY=';

  const authHeader = `Basic ${Buffer.from(privateKey + ':').toString('base64')}`;

  const formData = new FormData();
  formData.append('file', options.file);
  formData.append('fileName', options.fileName);
  formData.append('folder', options.folder || '/runmypg');
  formData.append('useUniqueFileName', String(options.useUniqueFileName !== false));

  const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    headers: {
      Authorization: authHeader,
    },
    body: formData,
  });

  const json = (await res.json()) as {
    fileId?: string;
    name?: string;
    url?: string;
    thumbnailUrl?: string;
    height?: number;
    width?: number;
    size?: number;
    message?: string;
    help?: string;
  };

  if (!res.ok || !json.fileId || !json.url) {
    const errorMsg = json.message || res.statusText || 'ImageKit upload failed';
    throw new Error(`ImageKit error: ${errorMsg}`);
  }

  return {
    fileId: json.fileId,
    name: json.name || options.fileName,
    url: json.url,
    thumbnailUrl: json.thumbnailUrl || json.url,
    height: json.height,
    width: json.width,
    size: json.size || 0,
  };
}

/**
 * Generates ImageKit client-side auth parameters if using ImageKit client SDK
 */
export function getImageKitAuthParams(): {
  token: string;
  expire: number;
  signature: string;
} {
  const privateKey =
    process.env.IMAGEKIT_PRIVATE_KEY?.trim() ||
    'private_PkrMol0KgxOnMemwf5oyb2DwMSY=';
  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 1800; // 30 minutes
  const signature = crypto
    .createHmac('sha1', privateKey)
    .update(token + expire)
    .digest('hex');

  return { token, expire, signature };
}
