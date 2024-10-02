'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faShield, faUser, faHeartCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { useRouter, usePathname } from "next/navigation"; // Import usePathname
import { useHomeContext } from '@/providers/HomeContext';

export default function Nav() {
    const router = useRouter();
    const { homeActiveView, setHomeActiveView } = useHomeContext();
    const pathname = usePathname(); // Lấy đường dẫn hiện tại

    // Hàm xử lý click cho các nút
    const handleNavigation = (view: string) => {
        switch (view) {
            case 'petcare':
                router.push('/petcare');
                break;
            case 'forum':
                router.push('/forum');
                break;
            case 'recs':
                router.push('/home');
                setHomeActiveView('main');
                break;
            case 'matches':
                router.push('/home');
                setHomeActiveView('side');
                break;
            case 'profile':
                router.push('/profile');
                break;
            default:
                break;
        }
    };

    // Hàm kiểm tra xem button có được chọn không dựa trên đường dẫn
    const isActive = (path: string): boolean => pathname.includes(path);

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex justify-around h-16">
            <button
                className={`flex-1 text-center py-2 ${isActive('/petcare') ? 'text-secondary' : 'text-primary'}`}
                onClick={() => handleNavigation('petcare')}
            >
                <FontAwesomeIcon icon={faShield} className="p-2 rounded-full text-xl" />
            </button>
            <button
                className={`flex-1 text-center py-2 ${isActive('/forum') ? 'text-secondary' : 'text-primary'}`}
                onClick={() => handleNavigation('forum')}
            >
                <FontAwesomeIcon icon={faComment} className="p-2 rounded-full text-xl" />
            </button>
            <button
                className={`flex-1 flex items-center justify-center py-2 cursor-pointer`}
                onClick={() => handleNavigation('recs')}
            >
                {(isActive('/home') && homeActiveView === 'main') || isActive('/pet') ? (
                    <img src='/images/logo-color.png' className='h-14' alt="Logo" />
                ) : (
                    <img src='/images/logo-white.png' className='h-10' alt="Logo" />
                )}

            </button>
            <button
                className={`flex-1 text-center py-2 ${isActive('/home') && homeActiveView === 'side' ? 'text-secondary' : 'text-primary'}`}
                onClick={() => handleNavigation('matches')}
            >
                <FontAwesomeIcon icon={faHeartCircleCheck} className="p-2 rounded-full text-xl" />
            </button>
            <button
                className={`flex-1 text-center py-2 ${isActive('/profile') ? 'text-secondary' : 'text-primary'}`}
                onClick={() => handleNavigation('profile')}
            >
                <FontAwesomeIcon icon={faUser} className="p-2 rounded-full text-xl" />
            </button>
        </div>
    );
}