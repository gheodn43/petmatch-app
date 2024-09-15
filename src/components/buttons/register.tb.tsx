'use client'
import { useRouter } from 'next/navigation';

export default function RegisterBtn() {
    const router = useRouter();
    const handleRegister = () => {
        router.push('/signup'); 
      };
    return <>
        <button
          onClick={handleRegister}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Đăng ký
        </button>
    </>
}