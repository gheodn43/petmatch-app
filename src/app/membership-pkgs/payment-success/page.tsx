'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import axios from 'axios';

export default function PagePaymentSuccess() {
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

  return (
    <div>
      <h1>Thanh toán thành công!</h1>
      <button onClick={() => router.push('/home')}>Quay về trang chủ</button>
    </div>
  );
}
