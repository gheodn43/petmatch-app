// 'use client'

// import HeaderForm from '@/components/signup/Header.form'
// import ProgressBar from '@/components/signup/ProgressBar'
// import SignupForm from '@/components/signup/Sign-up.form'
// import SignUpBtn from '@/components/signup/Sign-up.btn'
// import SignUpForm2 from '@/components/signup/Sign-up.form2'
// import SignUpForm3 from '@/components/signup/Sign-up.form3'
// import SignUpForm4 from '@/components/signup/Sign-up.form4'
// import { useState } from 'react';
// export default function SignUpPage() {
//     const totalSteps = [1, 2, 3, 4];
//     const [currentStep, setCurrentStep] = useState(1);
//     const [complete, setComplete] = useState(false);
//     const [user, setUser] = useState({
//       name: "",
//       email: "",
//       dateOfBirth: "",
//       gender: "male",
//       phoneNumber: "",
//       imgSrc: ""
//     });
  
//     return (
//       <div>
//         {currentStep === 4 ? (
//           <div>
//             <HeaderForm />
//             <SignUpForm4 />
//           </div>
//         ) : (
//           <div>
//             <HeaderForm />
//             <ProgressBar
//               totalStepInput={totalSteps}
//               currentStepInput={currentStep}
//               isComplete={complete}
//             />
//             {currentStep === 1 && <SignupForm setUserInput={setUser} user={user} />}
//             {currentStep === 2 && <SignUpForm2 setUserInput={setUser} user={user} />}
//             {currentStep === 3 && <SignUpForm3 />}
//             <SignUpBtn
//               currentStepInput={currentStep}
//               totalStepInput={totalSteps}
//               setComplete={setComplete}
//               setCurrentStep={setCurrentStep}
//             />    
//           </div>
//         )}
//       </div>
//     );
//   }
  
export default function SignUpPage(){
  return <></>
}