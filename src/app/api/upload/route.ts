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

    // Ensure public/uploads/media exists for Payload DAM pipeline
    const mediaDir = path.join(process.cwd(), 'public', 'uploads', 'media');
    await fs.mkdir(mediaDir, { recursive: true });

    // Attempt to load Payload instance for auto-WebP conversion
    let payloadInstance: any = null;
    try {
      const { getPayload } = await import('payload');
      const configPromise = (await import('@payload-config')).default;
      payloadInstance = await getPayload({ config: configPromise });
    } catch (payloadErr) {
      console.warn('[Upload API] Payload CMS unavailable, falling back to direct disk storage:', payloadErr);
    }

    // Validate all files before processing
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, message: `Le fichier "${file.name}" dépasse la limite maximale de 10 Mo` },
          { status: 400 }
        );
      }

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
    }

    // Process all uploads concurrently in parallel
    const results = await Promise.all(
      files.map(async (file, index) => {
        const ext = path.extname(file.name).toLowerCase() || '.webp';
        const buffer = Buffer.from(await file.arrayBuffer());
        const randomHash = crypto.randomBytes(6).toString('hex');
        const safeFilename = `prod_${Date.now()}_${index}_${randomHash}${ext}`;

        let mediaItem: any = null;
        let url = '';

        if (payloadInstance) {
          try {
            const mediaDoc = await payloadInstance.create({
              collection: 'media',
              data: {
                alt: file.name.replace(/\.[^/.]+$/, '') || 'Product Image',
              },
              file: {
                data: buffer,
                name: safeFilename,
                mimetype: file.type || 'image/jpeg',
                size: file.size,
              },
              overrideAccess: true,
            });

            if (mediaDoc) {
              const mobileFilename = mediaDoc.sizes?.mobile?.filename;
              const thumbFilename = mediaDoc.sizes?.thumbnail?.filename;
              const desktopFilename = mediaDoc.sizes?.desktop?.filename;
              const baseFilename = mediaDoc.filename || safeFilename;

              const primaryUrl = `/api/uploads/media/${baseFilename}`;
              const mobileUrl = mobileFilename ? `/api/uploads/media/${mobileFilename}` : primaryUrl;
              const thumbUrl = thumbFilename ? `/api/uploads/media/${thumbFilename}` : primaryUrl;
              const desktopUrl = desktopFilename ? `/api/uploads/media/${desktopFilename}` : primaryUrl;

              url = mobileUrl;
              mediaItem = {
                id: mediaDoc.id,
                url: primaryUrl,
                sizes: {
                  thumbnail: thumbUrl,
                  mobile: mobileUrl,
                  desktop: desktopUrl,
                },
              };
            }
          } catch (mediaErr) {
            console.warn('[Upload API] Payload media processing warning, falling back to disk:', mediaErr);
          }
        }

        if (!mediaItem) {
          const filePath = path.join(targetDir, safeFilename);
          await fs.writeFile(filePath, buffer);
          const fallbackUrl = `/api/uploads/products/${safeFilename}`;
          url = fallbackUrl;
          mediaItem = {
            url: fallbackUrl,
          };
        }

        return { url, mediaItem };
      })
    );

    const uploadedUrls = results.map((r) => r.url);
    const mediaItems = results.map((r) => r.mediaItem);

    return NextResponse.json({
      success: true,
      url: uploadedUrls[0],
      urls: uploadedUrls,
      media: mediaItems,
      count: uploadedUrls.length,
      message: `${uploadedUrls.length} image(s) téléversée(s) et optimisée(s) avec succès`,
    });
  } catch (error: any) {
    console.error('[Upload API] Error saving image file:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Erreur lors du téléversement du fichier' },
      { status: 500 }
    );
  }
}
