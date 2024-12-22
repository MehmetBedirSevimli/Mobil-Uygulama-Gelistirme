import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';



const firebaseConfig = {
  apiKey: "AIzaSyC62L22GQ_2OlY9tZqjuRSqPxyZM5KQGlA",
  authDomain: "elab-dbe79.firebaseapp.com",
  projectId: "elab-dbe79",
  storageBucket: "elab-dbe79.firebasestorage.app",
  messagingSenderId: "1094920687165",
  appId: "1:1094920687165:web:41d11c3190ec92d0c7e454",
  measurementId: "G-SBSF221BSF"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Firebase Auth modülü başlatıldı
const firestore = getFirestore(app); // Firestore başlatıldı

export { auth, firestore };