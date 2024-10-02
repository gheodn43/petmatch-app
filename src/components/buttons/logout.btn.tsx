'use client'
import { dbPet } from "@/localDB/pet.db";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LogoutBtn() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout');
            await dbPet.pet.clear();
            await dbPet.matched.clear();
            await dbPet.selected.clear();
            await dbPet.rcm.clear();
            router.push('/signin');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };
    return (
        <div className="py-4 border-y-2 cursor-pointer" onClick={handleLogout}>
            <p className="text-gray-600 text-center ">Đăng xuất</p>
        </div>
    );
}
