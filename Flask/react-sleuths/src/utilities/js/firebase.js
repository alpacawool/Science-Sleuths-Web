import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCraR3BWXcluEPPvACpTT5EkPWrS7Ob5B0",
  authDomain: "science-sleuths.firebaseapp.com",
  projectId: "science-sleuths",
  storageBucket: "science-sleuths.appspot.com",
  messagingSenderId: "737877556460",
  appId: "1:737877556460:web:ce829f5c674628b80af9c9",
  measurementId: "G-CE6Z8WXJ2R",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
