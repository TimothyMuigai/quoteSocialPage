// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
const firebaseConfig = {
  apiKey: "AIzaSyDklc6lo-lgmLdgLCBgTKXnqSwfE4zG-9k",
  authDomain: "quotegenerator-ddf5f.firebaseapp.com",
  projectId: "quotegenerator-ddf5f",
  storageBucket: "quotegenerator-ddf5f.firebasestorage.app",
  messagingSenderId: "808011894154",
  appId: "1:808011894154:web:31fc770c6b9cd32a22cc73",
  measurementId: "G-JPV0HR25XD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
export const auth = getAuth(app)
export default app;