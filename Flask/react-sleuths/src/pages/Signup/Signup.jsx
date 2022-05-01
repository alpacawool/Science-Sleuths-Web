/**
 * Signup.jsx
 * Page to create an account
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import TextField from "@mui/material/TextField";
import { auth, authUser } from "../../utilities/js/firebase";
import { createFetchRequest } from "../../utilities/js/fetchPostHelper";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

import "./Signup.scss";

export const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState({ firstName: "", lastName: "" });
  const [message, setMessage] = useState("");
  let user_id;
  let display_name;

  const onFormSubmit = (e) => {
    e.preventDefault();
    // check all fields are filled out
    if (!name.firstName || !name.lastName || !password || !email) {
      alert("All fields are required!");
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => authUser(auth))
      .then((user) => {
        user_id = user.uid;
        updateProfile(auth.currentUser, {
          displayName: `${name.firstName} ${name.lastName}`
        });
      })
      .then(() => { 
        const userData = {
          first_name: name.firstName,
          last_name: name.lastName,
          email: email,
          user_id: user_id
        }
        fetch(`/createUser`, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
      })
      .then(() => signInWithEmailAndPassword(auth, email, password))
      .then(() => authUser(auth))
      .then((user) => {
        user_id = user.uid;
        display_name = user.displayName;
        return user.getIdToken();
      })
      .then((idToken) => {
        fetch(`/sessionLogin`, createFetchRequest(idToken))
          .then((response) => response.json())
      })
      .then(() => {
        return signOut(auth);
      })
      .then(() => navigate("/dash", { state: { user_id: user_id, display_name: display_name } }))
      .catch((err) => {
      console.log(err);
      setMessage(err.code);
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
        {message && <p> {message} </p>}
        <br></br>
        <span className="login-message">
          Already have an account? <a href="/login">Log in.</a>
        </span>
      </form>
    </div>
  );
};
