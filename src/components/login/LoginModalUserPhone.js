import { useState } from "react";
import { Button } from "@headlessui/react";

export default function LoginModalUserPhone( {setStep} ) {

    const userInfo = {
        name: "",
        email: "",
        dateOfBirth: "",
        gender: "male",
        phoneNumber: "",
        imgSrc: ""
    }
    const [user, setUser] = useState(userInfo)

    const [countryCode, setCountryCode] = useState('VN +84');

    return (
        <div className="mb-10">
            <div className='flex justify-center align-items-center'>
                <img src="/images/logo-color.png" className=' w-[50px] h-[50px] object-cover' />
            </div>
            <div className='flex justify-center align-items-center mt-3'>
                <h1 className='font-bold text-[25px] font-Roboto text-center text-[#666666] px-6'>
                    Bạn có thể chia sẻ số điện thoại không?
                </h1>
            </div>
            <div className='flex justify-center align-items-center mt-3'>
                <div className="flex gap-10 mb-5">
                    <div className="relative">
                        <label className="block text-[#666666] text-sm font-bold mb-2">Quốc gia</label>
                        <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="block appearance-none w-[120%] bg-white border border-gray-400 hover:border-gray-500 px-2 py-2 pr-2 rounded-[8px] shadow leading-normal focus:outline-none focus:shadow-outline text-[#666666]"
                        >
                            <option value="VN +84">VN +84</option>
                            <option value="US +1">US +1</option>
                            <option value="UK +44">UK +44</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 left-[80%] top-[40%] flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 12l-6-6h12z" /></svg>
                        </div>
                    </div>

                    <div className="relative">
                        <label className="block text-[#666666] text-sm font-bold mb-2">Số điện thoại</label>
                        <input
                            type="text"
                            value={user.phoneNumber}
                            onChange={(e) => setUser(prev => ({ ...prev, phoneNumber: e.target.value }))}
                            className="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded-[8px] shadow leading-normal  focus:outline-none focus:shadow-outline"
                            placeholder="Nhập số điện thoại"
                        />
                    </div>
                </div>
            </div>

            <div className='flex justify-center align-items-center mt-3 mb-6'>
                <Button
                    className="rounded-[25px] font-black font-Nunito w-44 h-14 bg-gradient-to-r text-[#666666] justify-items-end border"
                    onClick={()=>{setStep(3)}}
                >
                    TIẾP THEO
                </Button>
            </div>
        </div>
    )
}
