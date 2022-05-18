import { initializeApp } from "firebase/app";
import { onAuthStateChanged } from "firebase/auth"
import {
  browserSessionPersistence,
  getAuth,
  setPersistence
} from "firebase/auth";
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
setPersistence(auth, browserSessionPersistence);

const authUser = (auth) => {
  return new Promise( (resolve, reject) => {
     onAuthStateChanged(auth, (user) => {
        if (user) {
           resolve(user);
        } else {
           reject('User not logged in');
        }             
     });
  });
}

const parseFirebaseAuthError = (errCode) => {
   if (errCode === "auth/user-not-found") {
      return "Error: User not found.";
   } else if (errCode === "auth/session-cookie-expired") {
      return "Error: Session cookie expired.";
   } else if (errCode === "auth/invalid-password") {
      return "Error: Invalid password provided. Passwords must be at least six characters long.";
   } else if (errCode === "auth/weak-password") {
      return "Error: Weak password provided. Passwords must be at least six characters long.";
   } else if (errCode === "auth/invalid-id-token") {
      return "Error: Invalid ID token.";
   } else if (errCode === "auth/invalid-email") {
      return "Error: Invalid email provided.";
   } else if (errCode === "auth/invalid-display-name") {
      return "Error: Invalid first or last name provided. Name cannot be blank.";
   } else if (errCode === "auth/invalid-credential") {
      return "Error: Invalid credential provided.";
   } else if (errCode === "auth/email-already-exists" || errCode === "auth/email-already-in-use") {
      return "Error: Email is already in use.";
   } else if (errCode === "auth/id-token-expired") {
      return "Error: Token expired.";
   } else if (errCode === "auth/wrong-password") {
      return "Error: Incorrect password, please try again.";
   } else {
      return errCode;
   }
}

export { auth, db, authUser, parseFirebaseAuthError };
