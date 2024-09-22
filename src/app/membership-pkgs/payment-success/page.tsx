'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const PaymentSuccessContent = () => {
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
    <div className="flex flex-col items-center justify-center h-full mt-36">
      <div className="bg-white p-10 rounded-lg shadow-md text-center">
        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-6xl mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h1>
        <p className="text-gray-600 mb-6">Cảm ơn bạn đã hoàn tất thanh toán. Đơn hàng của bạn đã được xử lý.</p>
        <button
          className="bg-[#FFD971] text-black px-6 py-3 rounded-lg hover:bg-yellow-500 transition"
          onClick={() => router.push('/home')}
        >
          Quay lại trang chủ
        </button>
      </div>
    </div>
  );
}

export default function PagePaymentSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
