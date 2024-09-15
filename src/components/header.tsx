import Link from 'next/link';
import LoginBtn from '@/components/buttons/login.btn';

export default function Header() {
    return (
        <header className="w-full px-4 h-[10vh] bg-gradient-to-b from-black via-transparent to-transparent header-gradient flex items-center justify-between">
            <div className="flex items-end space-x-2">
                <img
                    src="/images/logo-white.png"
                    alt="Logo"
                    className="w-[50px] sm:w-[50px] md:w-[60px] lg:w-[80px]"
                />
                <span className="text-white font-jomhuria font-bold text-[1.5rem] sm:text-[1.5rem] md:text-[1.8rem] lg:text-[2.2rem] tracking-wide">
                    Petmatch
                </span>
            </div>
            <div className="flex items-end space-x-6 text-white ">
                <Link href="/">
                    <p className="responsive-font-small leading-6 font-nunito">
                        Diễn Đàn
                    </p>
                </Link>
                <Link href="/">
                    <p className="responsive-font-small leading-6 font-nunito">
                        Tư Vấn
                    </p>
                </Link>
                <Link href="/">
                    <p className="responsive-font-small leading-6 font-nunito ">
                        Về Chúng Tôi
                    </p>
                </Link>
            </div>
            <LoginBtn/>
        </header>
    );
}
