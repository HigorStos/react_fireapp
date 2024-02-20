import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBtZcXn0JJql9uAVktzKqTtiR4Vitvq_Dw",
  authDomain: "curso-sp-47d05.firebaseapp.com",
  projectId: "curso-sp-47d05",
  storageBucket: "curso-sp-47d05.appspot.com",
  messagingSenderId: "1019285128305",
  appId: "1:1019285128305:web:0c0dddb536acd926d9c7d0",
  measurementId: "G-B2MWWMN7LT",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { db, auth };
