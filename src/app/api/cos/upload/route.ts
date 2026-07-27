import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { uploadBuffer, generateUploadKey } from '@/lib/cos';

export async function POST(request: Request) {
  try {
    await requireAuth();

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: '请选择要上传的文件' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = generateUploadKey(file.name);

    const result = await uploadBuffer(buffer, key);

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        key: result.fileName,
      },
    });
  } catch (error) {
    console.error('COS upload error:', error);
    return NextResponse.json(
      { success: false, message: '上传失败' },
      { status: 500 }
    );
  }
}