// import { useState, useRef, ChangeEvent } from "react";

// interface SignupFormProps {
//   setUserInput: (input: any) => void;
//   user: {
//     imgSrc: string;
//     name: string;
//     email: string;
//     gender: string;
//   };
// }

// export default function SignupForm({ setUserInput, user }: SignupFormProps) {
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const [imageSrc, setImageSrc] = useState<string>(user.imgSrc);

//   const handleDivClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         if (reader.result) {
//           setImageSrc(reader.result as string);
//           setUserInput((prev: any) => ({ ...prev, imgSrc: reader.result }));
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const [selectedGender, setSelectedGender] = useState<string>(user.gender);

//   const handleGenderChange = (event: ChangeEvent<HTMLInputElement>) => {
//     setSelectedGender(event.target.value);
//     setUserInput((prev: any) => ({ ...prev, gender: event.target.value }));
//   };

//   return (
//     <div>
//       <div onClick={handleDivClick}>
//         {imageSrc ? (
//           <img src={imageSrc} alt="User" />
//         ) : (
//           <div className="placeholder-image">No Image</div>
//         )}
//       </div>
//       <input
//         ref={fileInputRef}
//         type="file"
//         onChange={handleFileChange}
//         style={{ display: "none" }}
//       />
//       <div>
//         <label htmlFor="gender">Gender:</label>
//         <input
//           type="radio"
//           id="male"
//           name="gender"
//           value="male"
//           checked={selectedGender === "male"}
//           onChange={handleGenderChange}
//         />
//         <label htmlFor="male">Male</label>
//         <input
//           type="radio"
//           id="female"
//           name="gender"
//           value="female"
//           checked={selectedGender === "female"}
//           onChange={handleGenderChange}
//         />
//         <label htmlFor="female">Female</label>
//       </div>
//     </div>
//   );
// }