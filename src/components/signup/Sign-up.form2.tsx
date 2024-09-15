import { useState, ChangeEvent } from "react";

interface SignUpForm2Props {
  setUserInput: (input: any) => void;
  user: {
    phoneNumber: string;
  };
}

export default function SignUpForm2({ setUserInput, user }: SignUpForm2Props) {
  const [countryCode, setCountryCode] = useState<string>('VN +84');

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput((prev: any) => ({ ...prev, phoneNumber: e.target.value }));
  };

  return (
    <div className="flex justify-center items-center absolute top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[250px] rounded-[30px] bg-[#FEDF79] bg-opacity-20 w-[30vw]">
      <div className="flex gap-10 mb-5">
        <div className="relative">
          <label className="block text-gray-700 text-sm font-bold mb-2">Quốc gia</label>
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="block appearance-none w-[120%] bg-white border border-gray-400 hover:border-gray-500 px-2 py-2 pr-2 rounded shadow leading-loose focus:outline-none focus:shadow-outline"
          >
            <option value="VN +84">VN +84</option>
            <option value="US +1">US +1</option>
            <option value="UK +44">UK +44</option>
            {/* Add more country codes as needed */}
          </select>
          <div className="pointer-events-none absolute inset-y-0 left-[80%] top-[40%] flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M10 12l-6-6h12z" />
            </svg>
          </div>
        </div>

        <div className="relative">
          <label className="block text-gray-700 text-sm font-bold mb-2">Số điện thoại</label>
          <input
            type="text"
            value={user.phoneNumber}
            onChange={handlePhoneNumberChange}
            className="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow leading-loose focus:outline-none focus:shadow-outline"
            placeholder="Nhập số điện thoại"
          />
        </div>
      </div>
    </div>
  );
}