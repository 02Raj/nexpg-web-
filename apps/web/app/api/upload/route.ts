import { uploadToImageKit } from '@/lib/imagekit';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let file: string | null = null;
  let fileName: string = `upload_${Date.now()}`;
  let folder: string = '/runmypg/uploads';

  const contentType = req.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData();
    const uploadedFile = formData.get('file');
    const folderField = formData.get('folder');
    if (folderField && typeof folderField === 'string') {
      folder = folderField;
    }

    if (uploadedFile instanceof Blob) {
      const buffer = Buffer.from(await uploadedFile.arrayBuffer());
      file = `data:${uploadedFile.type || 'image/png'};base64,${buffer.toString('base64')}`;
      if ('name' in uploadedFile && typeof uploadedFile.name === 'string') {
        fileName = uploadedFile.name;
      }
    } else if (typeof uploadedFile === 'string') {
      file = uploadedFile;
    }
  } else {
    try {
      const body = await req.json();
      file = body.file;
      if (body.fileName) fileName = body.fileName;
      if (body.folder) folder = body.folder;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
  }

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  try {
    const result = await uploadToImageKit({
      file,
      fileName,
      folder,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'ImageKit upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
