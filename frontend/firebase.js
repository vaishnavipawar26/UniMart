// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY, 
  authDomain: "unimart-website.firebaseapp.com",
  projectId: "unimart-website",
  storageBucket: "unimart-website.firebasestorage.app",
  messagingSenderId: "498512556581",
  appId: "1:498512556581:web:a44c78c0147a1b6a5205cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
export {app,auth}