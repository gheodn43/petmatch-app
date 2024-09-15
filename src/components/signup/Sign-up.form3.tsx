import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";

let currentOTPIndex = 0;

export default function SignUpForm3() {
  const [otp, setOtp] = useState<string[]>(new Array(5).fill(""));
  const [activeOTPIndex, setActiveOTPIndex] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newOTP = [...otp];
    newOTP[currentOTPIndex] = value.substring(value.length - 1);

    if (!value) setActiveOTPIndex(currentOTPIndex - 1);
    else setActiveOTPIndex(currentOTPIndex + 1);

    setOtp(newOTP);
    console.log(newOTP);
  };

  const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    currentOTPIndex = index;
    if (e.key === "Backspace") setActiveOTPIndex(currentOTPIndex - 1);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  return (
    <>
      <span className="flex justify-center absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-black font-Nunito text-[#666666] tracking-widest">
        Mã Xác Minh
      </span>

      <div className="flex justify-center items-center absolute top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[250px] rounded-[30px] bg-[#FEDF79] bg-opacity-20 w-[30vw]">
        <div className="flex justify-center items-center space-x-10">
          {otp.map((_, index) => (
            <div key={index} className="flex items-center">
              <input
                ref={activeOTPIndex === index ? inputRef : null}
                type="text"
                className="w-12 h-12 border-2 rounded bg-transparent outline-none text-center font-semibold text-xl spin-button-none border-gray-400 focus:border-gray-700 focus:text-gray-700 text-gray-400 transition"
                onChange={handleOnChange}
                onKeyDown={(e) => handleOnKeyDown(e, index)}
                value={otp[index]}
              />
            </div>
          ))}
        </div>
      </div>
      <span className="flex justify-center absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-black font-Nunito text-[#C1C1C1] tracking-wide">
        Bạn không nhận được OTP? <p className="text-[#FFC629] ml-1 underline"> Gửi lại. </p>
      </span>
    </>
  );
}
