import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, message: 'Content-Type multipart/form-data requis' },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    
    // Support single 'file' or multiple 'files'
    const files: File[] = [];
    const single = formData.get('file') as File | null;
    if (single && typeof single === 'object' && single.name) {
      files.push(single);
    }
    const multiple = formData.getAll('files') as File[];
    for (const f of multiple) {
      if (f && typeof f === 'object' && f.name && !files.includes(f)) {
        files.push(f);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Aucun fichier image trouvé dans la requête' },
        { status: 400 }
      );
    }

    const targetDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    await fs.mkdir(targetDir, { recursive: true });

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, message: `Le fichier "${file.name}" dépasse la limite maximale de 10 Mo` },
          { status: 400 }
        );
      }

      // Validate extension and MIME type
      const ext = path.extname(file.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          { success: false, message: `Extension non autorisée pour "${file.name}". Formats acceptés : JPG, PNG, WEBP, GIF, SVG` },
          { status: 400 }
        );
      }

      if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
        return NextResponse.json(
          { success: false, message: `Format MIME non autorisé pour "${file.name}"` },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const randomHash = crypto.randomBytes(6).toString('hex');
      const safeFilename = `prod_${Date.now()}_${randomHash}${ext}`;
      const filePath = path.join(targetDir, safeFilename);

      await fs.writeFile(filePath, buffer);
      uploadedUrls.push(`/api/uploads/products/${safeFilename}`);
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrls[0],
      urls: uploadedUrls,
      count: uploadedUrls.length,
      message: `${uploadedUrls.length} image(s) téléversée(s) avec succès`,
    });
  } catch (error: any) {
    console.error('[Upload API] Error saving image file:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Erreur lors du téléversement du fichier' },
      { status: 500 }
    );
  }
}
