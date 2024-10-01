// import { initializeApp } from "firebase/app";
// import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY as string,
//   authDomain: process.env.FIERBASE_AUTH_DOMAIN as string,
//   projectId: process.env.FIREBASE_PROJECT_ID as string,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET as string,
//   messagingSenderId: process.env.FIERBASE_MESSAGING_SENDER_ID as string,
//   appId: process.env.FIREBASE_APP_ID as string,
// };

// // Khởi tạo Firebase App
// const firebaseApp = initializeApp(firebaseConfig);

// // Khởi tạo Firebase Storage
// export const storage = getStorage(firebaseApp);

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCrqHrgG4Ilj_CizofdkQIxSdy6_YeZEQM",
  authDomain: "pet-match-image.firebaseapp.com",
  projectId: "pet-match-image",
  storageBucket: "pet-match-image.appspot.com",
  messagingSenderId: "248433055628",
  appId: "1:248433055628:web:783819bc2c60e405f0a8a9",
};

// Khởi tạo Firebase App
const firebaseApp = initializeApp(firebaseConfig);

// Khởi tạo Firebase Storage
export const storage = getStorage(firebaseApp);

