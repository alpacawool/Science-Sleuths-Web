import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
import { Navigate } from "react-router-dom";

const firebaseConfig = {
  apiKey: "AIzaSyCraR3BWXcluEPPvACpTT5EkPWrS7Ob5B0",
  authDomain: "science-sleuths.firebaseapp.com",
  projectId: "science-sleuths",
  storageBucket: "science-sleuths.appspot.com",
  messagingSenderId: "737877556460",
  appId: "1:737877556460:web:ce829f5c674628b80af9c9",
  measurementId: "G-CE6Z8WXJ2R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const doc = db.collection('Users').doc(user.uid).get();
    if (doc.length === 0) {
      await addDoc(collection(db, "Users"), {
        name: user.displayName,
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = (email, password) => {
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        // signed in
        const user = userCredential.user;
        console.log(user.uid);
    }).catch(err => {
        const errCode = err.code;
        const errMessage = err.message;
        console.log(errMessage);
    });
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "Users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};