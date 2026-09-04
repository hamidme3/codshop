import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const documentType = formData.get('type') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'Fichier requis' }, { status: 400 });
    }

    // Validate size (< 10 MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'La taille du fichier ne doit pas dépasser 10 Mo' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get clean extension
    const ext = path.extname(file.name).toLowerCase() || '.jpg';
    if (!['.pdf', '.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
      return NextResponse.json(
        { error: 'Format non autorisé. Formats acceptés : PDF, PNG, JPG' },
        { status: 400 }
      );
    }

    const randomHash = crypto.randomBytes(8).toString('hex');
    const safeFilename = `kyc_${Date.now()}_${randomHash}${ext}`;
    const targetDir = path.join(process.cwd(), 'public', 'uploads', 'kyc');

    await fs.mkdir(targetDir, { recursive: true });
    await fs.writeFile(path.join(targetDir, safeFilename), buffer);

    const fileUrl = `/uploads/kyc/${safeFilename}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: file.name,
      documentType: documentType || 'document',
    });
  } catch (err: any) {
    console.error('[KYC Upload] Error:', err);
    return NextResponse.json({ error: 'Erreur lors de l upload du document' }, { status: 500 });
  }
}
