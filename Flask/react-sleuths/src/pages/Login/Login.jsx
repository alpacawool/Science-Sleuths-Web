/**
 * Login.jsx
 * Login page where user will login to access dashboard
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import "./Login.scss";

import { auth } from "../../utilities/js/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // if user's already authenticated
    if (user) navigate("/dash");
  }, [navigate, user]);

  const onFormSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return user.getIdToken();
      })
      .then((idToken) => {
        return fetch(`/sessionLogin`, {
          method: "POST",
          withCredentials: true,
          credentials: "include",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        });
      })
      .then(() => {
        navigate("/dash");
        // return auth.signOut();
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.code);
      });
  };

  return (
    <div className="form-container">
      <form className="login-form">
        <h1>Hello!</h1>

        <TextField
          fullWidth
          margin="normal"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="Password"
          variant="outlined"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />

        <button type="submit" onClick={onFormSubmit} className="login-button">
          Login
        </button>
        <p>{errorMessage}</p>
        <br></br>
        <span className="signup-message">
          Don't have an account yet? <a href="/signup">Sign up.</a>
        </span>
      </form>
    </div>
  );
};

export default Login;
