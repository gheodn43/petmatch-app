'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
    const router = useRouter();
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const url = urlParams.get('url');
        if (url) {
            setPaymentUrl(url);
        } else {
            router.push('/membership-pkgs');
        }
    }, [router]);

    return (
        <div className="flex justify-center items-center h-screen p-4">
            {paymentUrl ? (
                <iframe
                    src={paymentUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                    title="Payment"
                />
            ) : (
                <p>Đang tải...</p>
            )}
        </div>
    );
}
