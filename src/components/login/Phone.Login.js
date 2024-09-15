const PhoneNumberLoginButton = ( {setStep} ) => {
  return (
    <button
      className="border-[1px] text-black font-medium tracking-[0.25px] text-[14px] font-Roboto py-2 px-4 rounded-[20px] w-[260px] flex items-center justify-between"
      type="button"
      onClick={()=>{setStep(2)}}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 pe-">
      <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
    </svg>
      <p>Đăng nhập với Số điện thoại</p>
    </button>
  );
};

export default PhoneNumberLoginButton;