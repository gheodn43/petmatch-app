import Header from '@/components/header';
import { Button } from '@headlessui/react'
//import RegisterBtn from '@/components/buttons/register.tb';

export default function Home() {
  return (
    <div className="relative flex flex-col h-screen bg-custom">
        <Header/>
        <div className='absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <h1 className="xl:text-[140px] lg:text-[100px] md:text-[70px] sm:text-[50px] font-black font-sans text-transparent bg-clip-text bg-gradient-to-tr from-[#FFFCFC] to-[#FED236]">Quẹt Phải</h1>
          <div className="flex justify-end relative left-10">
            <h1 className="xl:text-[40px] lg:text-[30px] md:text-[20px] sm:text-[10px] font-black font-sans text-white tracking-wide">Cho thú cưng của bạn</h1>
          </div>
          <div className="flex justify-center mt-10">
            <Button className="rounded-[25px] font-black font-sans w-60 h-16 bg-gradient-to-r from-[#FFC300] to-[#FEDF79] text-white">
              Tạo tài khoản
            </Button>
          </div>
        </div>
    </div>
  );
}
