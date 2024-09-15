import { useState, useRef, useEffect } from "react";
import { Button } from "@headlessui/react";

let currentOTPIndex = 0;
export default function ConfirmEmailOTP() {


    const [otp, setOtp] = useState(new Array(5).fill(""));
    const [activeOTPIndex, setActiveOTPIndex] = useState(0);

    const inputRef = useRef(null);

    const handleOnChange = ({ target }) => {
        const { value } = target;
        const newOTP = [...otp];
        newOTP[currentOTPIndex] = value.substring(value.length - 1);

        if (!value) setActiveOTPIndex(currentOTPIndex - 1);
        else setActiveOTPIndex(currentOTPIndex + 1);

        setOtp(newOTP);
        console.log(newOTP);
    };

    const handleOnKeyDown = (e, index) => {
        currentOTPIndex = index;
        if (e.key === "Backspace") setActiveOTPIndex(currentOTPIndex - 1);
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, [activeOTPIndex]);

    return (
        <div className="mb-10">
            <div className='flex justify-center align-items-center'>
                <img src="/images/logo-color.png" className=' w-[50px] h-[50px] object-cover' />
            </div>
            <div className='flex justify-center align-items-center mt-3'>
                <h1 className='font-bold text-[25px] font-Roboto text-center text-[#666666] px-6'>
                Xác minh địa chỉ Email 
                </h1>
            </div>
            <div className='flex justify-center align-items-center mt-3 mb-2'>
                <h5 className='font-bold  text-[13px] font-Roboto text-center text-[#666666] px-6'>
                Hãy cung cấp mã xác minh chúng tôi đã gửi thông qua email liên kết với số điện thoại của bạn.
                </h5>
            </div>
            <div className='flex justify-center align-items-center mt-3 mb-6 '>
                    <div className={"flex justify-center items-center space-x-3"}>
                        {otp.map((_, index) => {
                            return (
                                <div key={index} className="flex items-center">
                                    <input
                                        ref={activeOTPIndex === index ? inputRef : null}
                                        type="text"
                                        className={
                                            "w-12 h-12 border-2 rounded-[8px] bg-transparent outline-none text-center font-semibold text-xl spin-button-none border-gray-400 focus:border-gray-700 focus:text-gray-700 text-gray-400 transition"
                                        }
                                        onChange={handleOnChange}
                                        onKeyDown={(e) => handleOnKeyDown(e, index)}
                                        value={otp[index]}
                                    />
                                </div>
                            );
                        })}
                </div>
            </div>

            <div className='flex justify-center align-items-center mt-3 mb-6'>
                <Button
                    className="rounded-[25px] font-black font-Nunito w-44 h-14 bg-gradient-to-r text-[#666666] justify-items-end border"
                >
                    TIẾP THEO
                </Button>
            </div>
        </div>
    )
}
