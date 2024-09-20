import diacritics from 'diacritics';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from '@/lib/s3';
function sanitizeFileName(fileName: string): string {
    let sanitizedName = diacritics.remove(fileName);
    sanitizedName = sanitizedName
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9._-]/g, '_');
    return sanitizedName;
}

export async function uploadFileToS3(buffer: Buffer, fileName: string, contentType: string) {
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