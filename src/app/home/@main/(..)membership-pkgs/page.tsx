'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function MembershipPkgs() {
    const router = useRouter();
    const handlePayment = async (packageName: string) => {
        try {
            const response = await axios.post('/api/membership-pkgs/checkout', { package: packageName });
            const checkoutLink: string = response.data.paymentLink;
            const orderCode: string = response.data.orderCode;
            router.push(checkoutLink);
        } catch (error) {
            console.error('Đã xảy ra lỗi khi gọi API thanh toán:', error);
        }
    };
    return (
        <div className="flex flex-col items-center p-2 h-screen space-y-6">
            <div className='flex flex-col items-center justify-evenly xl:flex-row space-y-4 xl:space-y-0 xl:space-x-6 w-full h-full px-20'>
                <div className="flex flex-col p-10 w-full h-3/5 xl:w-[25%] bg-[#FFF9E4]  bg-opacity-50 border-4 border-gray-200 rounded-lg shadow-lg relative xl:bottom-[10%]">
                    <div className='flex items-center justify-center flex-col border-b-2 border-black '>
                        <h2 className="text-4xl text-gray-800 mb-2 font-extrabold font-sans">Free</h2>
                        <h3 className="text-2xl text-gray-800 mb-6 italic font-sans">Miễn phí</h3>
                    </div>
                    <ul className="text-gray-700 space-y-4 mt-8 mb-4 pb-8 border-b-2 border-black ">
                        <li><FontAwesomeIcon size='2xl' icon={faCheck} className="text-[#09F811] mr-5" />10-20 Swipe mỗi ngày</li>
                        <li><FontAwesomeIcon size='2xl' icon={faCheck} className="text-[#09F811] mr-5" />Không xem được ai đã thích bạn.</li>
                        <li><FontAwesomeIcon size='2xl' icon={faCheck} className="text-[#09F811] mr-5" />Chat khi match.</li>
                        <li><FontAwesomeIcon size='2xl' icon={faCheck} className="text-[#09F811] mr-5" />Quảng cáo hiển thị.</li>
                        <li><FontAwesomeIcon size='2xl' icon={faCheck} className="text-[#09F811] mr-5" />Hồ sơ hiển thị thông thường trong tìm kiếm.</li>
                    </ul>
                    <span className='text-gray-800 font-extralight text-xs italic'>
                    *Dành cho những ai muốn bắt đầu trải nghiệm cơ bản, tìm kiếm đối tác thú cưng miễn phí!
                    </span>
                </div>
                <div className="flex flex-col p-10 w-full h-3/5 xl:w-[25%] bg-gradient-to-b from-[#FFF9E4] to-[#FFD151]  bg-opacity-50 border-4 border-gray-200 rounded-lg shadow-lg relative xl:bottom-[10%]">
                    <div className='flex items-center justify-center flex-col border-b-2 border-black rounded-sm'>
                        <h2 className="text-4xl text-gray-800 mb-2 font-extrabold font-sans">VIP</h2>
                        <h3 className="text-2xl text-gray-800 mb-6 italic font-sans">50.000 VND (1 Tháng)</h3>
                    </div>
                    <ul className="text-gray-700 space-y-4 mt-8 mb-8">
                        <li><FontAwesomeIcon size='2xl' icon={faCheck} className="text-[#09F811] mr-5" />Xem ngay ai đã thích bạn.</li>
                        <li><FontAwesomeIcon size='2xl' icon={faCheck} className="text-[#09F811] mr-5" />Undo swipe để sửa lại quyết định.</li>
                        <li><FontAwesomeIcon size='2xl' icon={faCheck} className="text-[#09F811] mr-5" />Không quảng cáo.</li>
                        <li><FontAwesomeIcon size='2xl' icon={faCheck} className="text-[#09F811] mr-5" />Xem đánh giá.</li>
                    </ul>
                    <button 
                        className="mt-4 p-2 bg-[#555145] text-white rounded mb-4"
                        onClick={() => handlePayment('VIP')}
                    >
                        Thanh toán
                    </button>
                    <span className='text-gray-800 font-extralight text-xs italic'>
                    *Dành cho những người dùng nghiêm túc muốn tìm đối tác chất lượng và có trải nghiệm tốt nhất trên PetMatch!
                    </span>
                </div>
                <div className="flex flex-col p-10 w-full h-3/5 xl:w-[25%] bg-gradient-to-b from-[#FFF9E4] to-[#FFD151] bg-opacity-50 border-4 border-gray-200 rounded-lg shadow-lg relative xl:bottom-[10%]">
                    <div className='flex items-center justify-center flex-col border-b-2 border-black rounded-sm'>
                        <h2 className="text-4xl text-gray-800 mb-2 font-extrabold font-sans">PREMIUM</h2>
                        <h3 className="text-2xl text-gray-800 mb-6 italic font-sans">200.000 VND (6 Tháng)</h3>
                    </div>
                    <ul className="text-gray-700 space-y-2 mt-8 mb-2">
                        <li><FontAwesomeIcon size='2xl' icon={faCheck} className="text-[#09F811] mr-5" />Swipes không giới hạn.</li>
                        <li><FontAwesomeIcon size='2xl' icon={faCheck} className="text-[#09F811] mr-5" />Xem ngay ai đã thích bạn.</li>
                        <li><FontAwesomeIcon size='2xl' icon={faCheck} className="text-[#09F811] mr-5" />Undo swipe để sửa lại quyết định.</li>
                        <li><FontAwesomeIcon size='2xl' icon={faCheck} className="text-[#09F811] mr-5" />Không quảng cáo.</li>
                        <li><FontAwesomeIcon size='2xl' icon={faCheck} className="text-[#09F811] mr-5" />Xem đánh giá.</li>
                    </ul>
                    <button 
                        className="mt-4 p-2 bg-[#555145] text-white rounded mb-4"
                        onClick={() => handlePayment('Premium')}
                    >
                        Thanh toán
                    </button>
                    <span className='text-gray-800 font-extralight text-xs italic'>
                    *Dành cho những người dùng nghiêm túc muốn tìm đối tác chất lượng và có trải nghiệm tốt nhất trên PetMatch!
                    </span>
                </div>
                
            </div>
        </div>
    );
}
