'use client';

import { Suspense } from 'react';
import PetInfo from '@/components/pet/petInfo';

export default function PetInfoPage() {
    return (
        <Suspense fallback={<p>Loading pet information...</p>}>
            <PetInfo />
        </Suspense>
    );
}
