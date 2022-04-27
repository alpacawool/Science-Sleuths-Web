/**
 * Signup.jsx
 * Page to create an account
 */
import React, { useEffect, useState } from "react";
import { useNavigate, Link, useHistory } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import TextField from "@mui/material/TextField";
import { auth, db } from "../../utilities/js/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import "./Signup.scss";

export const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState({ firstName: "", lastName: "" });
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/dash");
    if (error) {
      // error message
      console.log("Error creating user!");
    }
  }, [user, loading, error]);

  const onFormSubmit = (e) => {
    e.preventDefault();
    // check all fields are filled out
    if (!name.firstName || !name.lastName || !password || !email)
      alert("All fields are required!");
    createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        // create user in Firestore with document ID equal to user's ID
        setDoc(doc(db, "Users", res.user.uid), {
          first_name: name.firstName,
          last_name: name.lastName,
          email: email,
          owned_projects: [],
        });
      })
      .catch((err) => {
        const errCode = err.code;
        const errMessage = err.message;
        console.log(errCode, errMessage);
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
