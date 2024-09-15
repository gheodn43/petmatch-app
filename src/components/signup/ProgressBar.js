export default function ProgressBar({ totalStepInput, currentStepInput, isComplete }) {
  return (
    <>
      <div className='mt-10'>
        <div className='flex justify-center'>
          <h1 className="xl:text-[25px] lg:text-[23px] md:text-[20px] sm:text-[10px] font-black font-Nunito text-black tracking-widest">Thiết Lập Tài Khoản</h1>
        </div>
        <div className='flex justify-center'>
          {totalStepInput.map((step, i) => (
            <div
              key={i}
              className={`step-item ${currentStepInput === i + 1 && "active"} ${(i + 1 < currentStepInput || isComplete) && "complete"}`}
            ></div>
          ))}
        </div>
      </div>
    </>
  );
}
