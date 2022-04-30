/**
 * Signup.jsx
 * Page to create an account
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import TextField from "@mui/material/TextField";
import { auth } from "../../utilities/js/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import "./Signup.scss";

export const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState({ firstName: "", lastName: "" });
  const [user] = useAuthState(auth);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // if user's already authenticated
    if (user) navigate("/dash");
  }, [navigate, user]);

  const onFormSubmit = (e) => {
    e.preventDefault();
    // check all fields are filled out
    if (!name.firstName || !name.lastName || !password || !email) {
      alert("All fields are required!");
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => signInWithEmailAndPassword(auth, email, password))
      .then((user) => {
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
        return auth.signOut();
      })
      .catch((err) => {
        console.log(err.code);
        setErrorMessage(err.code);
      });
  };

  return (
    <div className="form-container">
      <form className="signup-form">
        <h1>Create an account</h1>

        <TextField
          fullWidth
          margin="normal"
          label="First Name"
          variant="outlined"
          value={name.firstName}
          name="firstName"
          onChange={(e) => {
            setName({
              ...name,
              [e.target.name]: e.target.value,
            });
          }}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Last Name"
          variant="outlined"
          value={name.lastName}
          name="lastName"
          onChange={(e) => {
            setName({
              ...name,
              [e.target.name]: e.target.value,
            });
          }}
        />

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

        <button type="submit" onClick={onFormSubmit} className="signup-button">
          Sign up
        </button>

        <br></br>
        <span className="login-message">
          Already have an account? <a href="/login">Log in.</a>
        </span>
      </form>
    </div>
  );
};
