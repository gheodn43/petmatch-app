'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import axios from 'axios';

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const PAID = 'PAID';
  useEffect(() => {
    const status = searchParams.get('status');
    const orderCode = searchParams.get('orderCode') as string;

    if (status === PAID && orderCode) {
      axios.post('/api/user/update-role', { orderCode })
        .then((response) => {
          console.log('Role updated successfully:', response.data);
        })
        .catch((error) => {
          console.error('Error updating role:', error);
        });
    } else if (status === 'failed') {
      console.error('Payment failed');
      router.push('/membership-pkgs');
    }
  }, [searchParams, router]);

  return <></>;
}
