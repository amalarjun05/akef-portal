import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  signInWithPopup,
  signOut 
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with your actual config from Firebase Console -> Project Settings
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZZaduIdYbayekoOtHyPbUxOEXEtAX-bY",
  authDomain: "akef-dd705.firebaseapp.com",
  projectId: "akef-dd705",
  storageBucket: "akef-dd705.firebasestorage.app",
  messagingSenderId: "226831119122",
  appId: "1:226831119122:web:14cc702449651d158179cb",
  measurementId: "G-3WT3B0X7FG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider(); 