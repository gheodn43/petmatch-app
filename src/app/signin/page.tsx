import Header from '@/components/header';
import { Button } from '@headlessui/react'
import LoginBtn from '@/components/buttons/login.btn';
//import RegisterBtn from '@/components/buttons/register.tb';

export default function Home() {
  return (
    <div className="relative flex flex-col h-screen bg-custom">
      <Header />
      <div className='absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <h1 className=" text-6xl md:text-7xl lg:text-9xl pb-5 font-black font-sans text-transparent bg-clip-text bg-gradient-to-tr from-[#FFFCFC] to-[#FED236]">Quẹt Phải</h1>
        <div className="flex justify-end relative left-10">
          <h1 className="xl:text-[40px] lg:text-[30px] md:text-[20px] text-lg font-black font-sans text-white tracking-wide">Cho thú cưng của bạn</h1>
        </div>
        <div className="flex flex-col justify-center mt-10 gap-3">
          <div className='block md:hidden'>
            <LoginBtn />
          </div>
          <div className='flex justify-center'>
            <Button className="rounded-[25px] font-black font-sans w-72 h-12 bg-gradient-to-r from-[#FFC300] to-[#FEDF79] text-white">
              Tạo tài khoản
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
