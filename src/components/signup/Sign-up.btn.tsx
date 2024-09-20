// import { FC } from 'react';

// interface SignUpBtnProps {
//   currentStepInput: number;
//   totalStepInput: number[];
//   setComplete: (complete: boolean) => void;
//   setCurrentStep: (step: (prevStep: number) => number) => void;
// }

// const SignUpBtn: FC<SignUpBtnProps> = ({
//   currentStepInput,
//   totalStepInput,
//   setComplete,
//   setCurrentStep,
// }) => {
//   return (
//     <div className="flex justify-around absolute top-[85%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[58vw]">
//       <div>
//         {currentStepInput > 1 ? (
//           <button
//             className="rounded-[25px] font-black font-Nunito w-44 h-14 bg-[#EEEEEE] text-black"
//             onClick={() => {
//               setCurrentStep((prev) => prev - 1);
//             }}
//           >
//             QUAY LẠI
//           </button>
//         ) : (
//           <button className="rounded-[25px] font-black font-Nunito w-44 h-14 bg-[#EEEEEE] text-black invisible">
//             QUAY LẠI
//           </button>
//         )}
//       </div>
//       <button
//         className="rounded-[25px] font-black font-Nunito w-44 h-14 bg-gradient-to-r from-[#FFC300] to-[#FEDF79] text-white justify-items-end"
//         onClick={() => {
//           if (currentStepInput === totalStepInput.length) {
//             setComplete(true);
//           } else {
//             setCurrentStep((prev) => prev + 1);
//           }
//         }}
//       >
//         {currentStepInput === 1 && "TIẾP THEO"}
//         {currentStepInput === 2 && "XÁC MINH"}
//         {currentStepInput === 3 && "HOÀN TẤT"}
//       </button>
//     </div>
//   );
// };

// export default SignUpBtn;
