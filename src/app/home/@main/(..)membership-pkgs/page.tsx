'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function MembershipPkgs() {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };
    const handlePayment = async (packageName: string) => {
        try {
            const response = await axios.post('/api/membership-pkgs/checkout', { package: packageName });
            const checkoutLink: string = response.data.paymentLink;
            console.log(checkoutLink)
            router.push(checkoutLink);
        } catch (error) {
            console.error('Đã xảy ra lỗi khi gọi API thanh toán:', error);
        }
    };

    return (
        <div className="flex flex-col items-center p-2 h-screen space-y-6">
            <div className="flex justify-start w-full px-2 py-4">
                <button onClick={handleBack}>
                    <FontAwesomeIcon icon={faArrowLeft} className="text-gray-600 text-xl" />
                </button>
            </div>
            <div className='flex flex-col items-center justify-between xl:flex-row space-y-4 xl:space-y-0 xl:space-x-6 w-full px-20'>
                <div className="flex flex-col p-4 w-full xl:w-[30%] bg-gray-200 bg-opacity-50 border-4 border-gray-200 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">VIP</h2>
                    <ul className="text-gray-700 space-y-2">
                        <li>Ưu tiên hỗ trợ khách hàng</li>
                        <li>Truy cập không giới hạn</li>
                        <li>1 lần thanh toán miễn phí</li>
                    </ul>
                    <button 
                        className="mt-4 p-2 bg-gray-800 text-white rounded"
                        onClick={() => handlePayment('VIP')}
                    >
                        Thanh toán
                    </button>
                </div>
                <div className="flex flex-col p-4 w-full xl:w-[30%] bg-yellow-300 bg-opacity-50 border-4 border-yellow-300 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-yellow-800 mb-4">Gold</h2>
                    <ul className="text-yellow-700 space-y-2">
                        <li>Hỗ trợ ưu tiên cao</li>
                        <li>Truy cập không giới hạn</li>
                        <li>3 lần thanh toán miễn phí</li>
                    </ul>
                    <button 
                        className="mt-4 p-2 bg-yellow-800 text-white rounded"
                        onClick={() => handlePayment('Gold')}
                    >
                        Thanh toán
                    </button>
                </div>
                <div className="flex flex-col p-4 w-full xl:w-[30%] bg-gradient-to-r from-yellow-400 to-pink-500 bg-opacity-50 border-4 border-yellow-400 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-white mb-4">Premium</h2>
                    <ul className="text-white space-y-2">
                        <li>Hỗ trợ khách hàng 24/7</li>
                        <li>Truy cập không giới hạn tất cả tính năng</li>
                        <li>5 lần thanh toán miễn phí</li>
                    </ul>
                    <button 
                        className="mt-4 p-2 bg-white text-pink-500 rounded"
                        onClick={() => handlePayment('Premium')}
                    >
                        Thanh toán
                    </button>
                </div>
            </div>
        </div>
    );
}
