import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { getUserIdFromCookie } from '@/utils/authUtils';
import { v4 as uuidv4 } from 'uuid';
import { uploadFileToS3 } from '@/utils/uploadFIleUtils';



export async function POST(request: NextRequest) {
    try {
        const userIdOrResponse = await getUserIdFromCookie(request);
        if (userIdOrResponse instanceof NextResponse) return userIdOrResponse;
        const user_id = userIdOrResponse;

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
        const uploadCertificates = []
        for (const image of petInfo.images) {
            const buffer = Buffer.from(await image.arrayBuffer());
            const fileName = `${Date.now()}_${image.name}`;
            const contentType = image.type || 'image/jpeg';
            const uploadedFileName = await uploadFileToS3(buffer, fileName, contentType);
            uploadedImages.push(uploadedFileName);
        }
        for (const certificate of petInfo.certificates) {
            const buffer = Buffer.from(await certificate.arrayBuffer());
            const fileName = `${Date.now()}_${certificate.name}`;
            const contentType = certificate.type || 'image/jpeg';
            const uploadCertificate = await uploadFileToS3(buffer, fileName, contentType);
            uploadCertificates.push(uploadCertificate);
        }

        console.log(uploadedImages);
        console.log(uploadCertificates);
        return NextResponse.json({ success: true, uploadedImages }, { status: 200 });
    } catch (error) {
        console.error("Error uploading files:", error);
        return NextResponse.json({ error: (error as Error).message || "An error occurred" }, { status: 500 });
    }
}

