'use client'
import { useRouter } from 'next/navigation';

export default function LoginBtn() {
    const router = useRouter();
    const handleLogin = () => {
        router.push('/signin');
    };
    return <>
          <button
            className="text-sm px-8 py-3 md:text-lg md:px-6 lg:text-xl font-semibold font-Nunito leading-6 text-white border rounded-[30px] "
            onClick={handleLogin}
          >
            Đăng Nhập
          </button>
    </>
}