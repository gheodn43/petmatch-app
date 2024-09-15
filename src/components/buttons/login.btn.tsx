'use client'
import { useRouter } from 'next/navigation';

export default function LoginBtn() {
    const router = useRouter();
    const handleLogin = () => {
        router.push('/signin');
    };
    return <>
          <button
            className="responsive-text px-8 py-3 md:px-6 font-semibold font-Nunito leading-6 text-white border rounded-[30px] hover:bg-white hover:bg-opacity-10"
            onClick={handleLogin}
          >
            Đăng Nhập
          </button>
    </>
}