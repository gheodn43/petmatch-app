import LoginBtn from '@/components/buttons/login.btn';
import RegisterBtn from './buttons/register.tb';
export default function Header() {
    return (
        <header className="w-full h-[10vh] bg-gradient-to-b from-black via-transparent to-transparent header-gradient">
            <div className="relative space-x-4">
                <LoginBtn />
                <RegisterBtn/>
            </div>
        </header>
    );
}