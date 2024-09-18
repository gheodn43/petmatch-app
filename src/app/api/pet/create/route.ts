import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from '@/lib/s3';
import diacritics from 'diacritics';


function sanitizeFileName(fileName: string): string {
    let sanitizedName = diacritics.remove(fileName);
    // Thay thế khoảng trắng và các ký tự đặc biệt bằng dấu gạch dưới
    sanitizedName = sanitizedName
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9._-]/g, '_');
    return sanitizedName;
}

async function uploadFileToS3(buffer: Buffer, fileName: string, contentType: string) {
    const sanitizedFileName = sanitizeFileName(fileName);
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: sanitizedFileName,
        Body: buffer,
        ContentType: contentType,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${sanitizedFileName}`;
    return fileUrl;
}
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const petInfo = {
            petType: formData.get('petType') as string,
            petSpecies: formData.get('petSpecies') as string,
            petName: formData.get('petName') as string,
            petAge: formData.get('petAge') as string,
            birthCount: formData.get('birthCount') as string,
            gender: formData.get('gender') as string,
            pricing: formData.get('pricing') as string,
            images: formData.getAll('images') as File[], 
            certificates: formData.getAll('certificates') as File[]
        };
        if (!petInfo.images || petInfo.images.length === 0) {
            return NextResponse.json({ error: "Images are required." }, { status: 400 });
        }
        const uploadedImages = [];
        for (const image of petInfo.images) {
            const buffer = Buffer.from(await image.arrayBuffer());
            const fileName = `${Date.now()}_${image.name}`;
            const contentType = image.type || 'image/jpeg';
            const uploadedFileName = await uploadFileToS3(buffer, fileName, contentType);
            uploadedImages.push(uploadedFileName);
        }
        console.log(uploadedImages)
        return NextResponse.json({ success: true, uploadedImages }, { status: 200 });
    } catch (error) {
        console.error("Error uploading files:", error);
        return NextResponse.json({ error: (error as Error).message || "An error occurred" }, { status: 500 });
    }
}

