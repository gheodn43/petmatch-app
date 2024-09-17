// app/api/pet/create/route.ts

import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Parse the form data
        const formData = await request.formData();
        
        // Log simple fields
        const petInfo = {
            petType: formData.get('petType'),
            petSpecies: formData.get('petSpecies'),
            petName: formData.get('petName'),
            petAge: formData.get('petAge'),
            birthCount: formData.get('birthCount'),
            gender: formData.get('gender'),
        };

        console.log('Pet Info:', petInfo);

        // Log images
        const images = formData.getAll('images');
        console.log('Images:', images);

        return NextResponse.json({ message: 'Pet profile created successfully!' }, { status: 200 });
    } catch (error) {
        console.error("Error processing request", error);
        return NextResponse.json({ error: 'Failed to create pet profile.' }, { status: 500 });
    }
}
