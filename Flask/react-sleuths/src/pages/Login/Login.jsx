/**
 * Login.jsx
 * Login page where user will login to access dashboard
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import "./Login.scss";

import { auth } from "../../utilities/js/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) navigate("/dash");
    if (error) {
      // error message
      console.log("Error logging in!");
    }
  }, [navigate, user, loading, error]);

  const onFormSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password).catch((err) => {
      const errCode = err.code;
      const errMessage = err.message;
      console.log(errCode, errMessage);
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

        <button
          type="submit"
          onClick={(e) => {
            onFormSubmit(e);
          }}
          className="login-button"
        >
          Login
        </button>

        <br></br>
        <span className="signup-message">
          Don't have an account yet? <a href="/signup">Sign up.</a>
        </span>
      </form>
    </div>
  );
};

export default Login;
