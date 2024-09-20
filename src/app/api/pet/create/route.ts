import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { getUserIdFromCookie } from '@/utils/authUtils';
import { uploadFileToS3 } from '@/utils/uploadFIleUtils';
import { CreatePetDto, PetOverviewDto } from '@/app/model/pet';
import { v4 as uuidv4 } from 'uuid';

// Khởi tạo DynamoDB Client
const dynamoDB = new DynamoDBClient({});

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
        
        const uploadedImages: string[] = [];
        const uploadCertificates: string[] = [];

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

        const petDto = new CreatePetDto({
            user_id,
            pet_type: petInfo.petType,
            pet_species: petInfo.petSpecies,
            pet_name: petInfo.petName,
            pet_age: petInfo.petAge,
            pet_birth_count: petInfo.birthCount,
            pet_gender: petInfo.gender,
            pet_pricing: petInfo.pricing,
            pet_images: uploadedImages,
            pet_certificates: uploadCertificates,
            pet_status: 'active',
        });

        // Prepare DynamoDB request parameters
        const pet_id = uuidv4(); // Generate unique pet_id
        const params = {
            TableName: 'petmatch-pets',
            Item: {
                user_id: { S: petDto.user_id },
                pet_id: { S: pet_id },
                pet_type: { S: petDto.pet_type },
                pet_species: { S: petDto.pet_species },
                pet_name: { S: petDto.pet_name },
                pet_age: { S: petDto.pet_age },
                pet_birth_count: { S: petDto.pet_birth_count },
                pet_gender: { S: petDto.pet_gender },
                pet_pricing: { S: petDto.pet_pricing },
                pet_images: { L: petDto.pet_images.map(img => ({ S: img })) },
                pet_certificates: { L: petDto.pet_certificates.map(cert => ({ S: cert })) },
                pet_status: { S: petDto.pet_status }
            }
        };

        // Insert item into DynamoDB
        await dynamoDB.send(new PutItemCommand(params));

        // Create PetOverviewDto for response
        const petOverviewDto = new PetOverviewDto({
            pet_id,
            pet_name: petDto.pet_name,
            pet_type: petDto.pet_type,
            pet_species: petDto.pet_species,
            pet_images: petDto.pet_images,
            pet_gender: petDto.pet_gender,
            pet_pricing: petDto.pet_pricing,
            pet_status: petDto.pet_status,
        });
    console.log(petOverviewDto);
        return NextResponse.json(petOverviewDto, { status: 200 });
    } catch (error) {
        console.error("Error uploading files or creating pet:", error);
        return NextResponse.json({ error: (error as Error).message || "An error occurred" }, { status: 500 });
    }
}
