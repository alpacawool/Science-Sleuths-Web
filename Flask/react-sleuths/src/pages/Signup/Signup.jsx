/**
 * Signup.jsx
 * Page to create an account
 */
import { useNavigate } from "react-router-dom"
import TextField from "@mui/material/TextField";

import './Signup.scss'

export const Signup = () => {

    let navigate = useNavigate();

    const onFormSubmit = () => {
      navigate("/dash", {replace:true});
    }
  
    return (
      <div className="form-container">
        <form className="signup-form">
          <h1>Create an account</h1>
  
          <TextField
              fullWidth 
              margin="normal" 
              label="First Name" 
              variant="outlined" 
          />

          <TextField
              fullWidth 
              margin="normal" 
              label="Last Name" 
              variant="outlined" 
          />
          <TextField
              fullWidth 
              margin="normal" 
              label="Email"
              variant="outlined" 
          />

          <TextField
              fullWidth 
              margin="normal" 
              label="Password"
              Type="Password" 
              variant="outlined" 
          />
  
          <button 
            type="submit" 
            onClick={onFormSubmit}
            className="signup-button"
          >
            Sign up
          </button>
  
          <br></br>
          <span className="login-message">
            Already have an account? <a href="/login">Log in.</a>
          </span>
        </form>
      </div>
  )
}
