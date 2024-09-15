export default function SignUpForm4() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 flex items-center space-x-8 w-full justify-evenly mx-20">
        <div className="space-y-6 w-[500px]">
          <h1 className="text-2xl font-bold text-[#FFC629] font-Nunito">
            Đã <span className="text-[40px]">hoàn tất</span> hồ sơ của bạn!
          </h1>
          <p className="text-black font-bold text-2xl">
            Hoàn thành hồ sơ của bạn rồi! Bây giờ, thêm hồ sơ cho thú cưng để
            bắt đầu ghép đôi nào!
          </p>
          <div className="flex justify-end">
            <a
              href="#"
              className="text-[#F8D030] font-Nunito font-black text-[15px]"
            >
              Tạo hồ sơ thú cưng {">>"}
            </a>
          </div>
          <div className="">
            <button className="rounded-[25px] font-black font-Nunito w-60 h-16 bg-gradient-to-br from-[#FFC300] via-[#FEDF79] to-[#FFB800] text-white mt-10 ml-10">
              Tạo tài khoản
            </button>
          </div>
        </div>
        <div className="bg-[#FEDF79] bg-opacity-20 p-8 -rotate-[40deg] rounded-tl-[310px] rounded-tr-[130px] rounded-br-[300px] rounded-bl-[250px] w-[730px] h-[620px]">
          <img
            src="/images/photo-1.png"
            alt="Person with pet"
            className="w-[640px] h-[580px] rotate-[40deg] relative left-[150px]"
          />
        </div>
      </div>
    </div>
  );
}
