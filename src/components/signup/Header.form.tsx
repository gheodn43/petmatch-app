import Link from 'next/link';
import Image from 'next/image';

export default function HeaderForm() {
  return (
    <>
      <Link href="/">
        <div className='w-full bg-[#FFC629] h-[10vh] relative flex justify-center'>
          <Image 
            src="/images/logo-color.png" 
            alt="Logo" 
            width={300} 
            height={250} 
            className='absolute z-1 -top-[75px]' 
          />
        </div>
      </Link>
    </>
  );
}
