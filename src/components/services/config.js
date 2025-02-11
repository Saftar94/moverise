import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyBQj9JEX9s-wwBvqKq95N-tvTzrS1dYGM0",
    authDomain: "moverise-7975c.firebaseapp.com",
    projectId: "moverise-7975c",
    storageBucket: "moverise-7975c.firebasestorage.app",
    messagingSenderId: "727323091393",
    appId: "1:727323091393:web:e825abcefe1568548c4f40",
    measurementId: "G-HKQRZCFL3D"
  };
  
  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
//   export const auth = getAuth(app);