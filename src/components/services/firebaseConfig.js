import { initializeApp } from "firebase/app";
import { getAuth,setPersistence,browserLocalPersistence } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

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
  const auth = getAuth(app);
  const db = getFirestore(app);

export  {auth, db}

export default app;
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Auth persistence error:", error);
  });

enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.log('The current browser does not support persistence.');
    }
  });

