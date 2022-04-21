/**
 * Login.jsx
 * Login page where user will login to access dashboard
 */
import { useNavigate } from "react-router-dom"
import TextField from "@mui/material/TextField";
import './Login.scss'

const Login = () => {

  let navigate = useNavigate();

  const onFormSubmit = () => {
    console.log("Logged in!")
    navigate("/dash", {replace:true});
  }

  return (
    <div className="form-container">
      <form className="login-form">
        <h1>Hello!</h1>

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
            type="Password"
            variant="outlined" 
        />

        <button 
          type="submit" 
          onClick={onFormSubmit}
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
  )
}

export default Login