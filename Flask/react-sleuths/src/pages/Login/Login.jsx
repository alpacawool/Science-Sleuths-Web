/**
 * Login.jsx
 * Login page where user will login to access dashboard
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import "./Login.scss";

import { auth, authUser } from "../../utilities/js/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createFetchRequest } from "../../utilities/js/fetchPostHelper";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  let user_id;
  let display_name;

  const onFormSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => authUser(auth))
      .then((user) => {
        user_id = user.uid;
        display_name = user.displayName;
        return user.getIdToken();
      })
      .then((idToken) => {
        return fetch(`/sessionLogin`, createFetchRequest(idToken));
      })
      .then(() => {
        return signOut(auth);
      })
      .then(() =>
        navigate("/dash/projects", {
          state: { user_id: user_id, display_name: display_name },
        })
      )
      .catch((err) => {
        console.log(err);
        setMessage(err.code);
      });
  };

  return (
    <div className="form-container">
      <form className="login-form" onSubmit={onFormSubmit}>
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

        <button type="submit" className="login-button">
          Login
        </button>
        {message && <p> {message} </p>}
        <br></br>
        <span className="signup-message">
          Don't have an account yet? <a href="/signup">Sign up.</a>
        </span>
      </form>
    </div>
  );
};

export default Login;
