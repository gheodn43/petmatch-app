import { useRouter } from "next/navigation";    
export default function CTACreatePet() {
    const router = useRouter();
    const handleOpenCreateNewPet = () => {
        router.push('/pet/add-pet');
      };
    return (
        <div className="relative flex items-center justify-center px-5" onClick={handleOpenCreateNewPet}>
            <img src="/images/CTA-create-pet.svg" alt="CTA create pet" />
            <p className="absolute top-5 md:top-10 text-center
            text-gray-400 text-lg md:text-lg lg:text-xl xl:text-3xl font-sans font-black">
                Bạn chưa có thú cưng?
            </p>
            <div className="absolute rounded-3xl cursor-pointer 
            bottom-0 left-[5%]
            px-8 py-3 md:px-12 md:py-5 
            font-black font-sans text-primary
            bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400
            shadow-lg hover:shadow-2xl hover:bg-secondary-dark transition duration-300 ease-in-out 
            text-sm md:text-md lg:text-lg xl:2xl">
                Tạo hồ sơ ngay
            </div>
        </div>
    );
}
