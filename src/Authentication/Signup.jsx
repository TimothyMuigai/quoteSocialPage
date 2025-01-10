import { useState } from "react";
import { UseUserAuth } from "../context/UserAuthContext"
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const { signup } = UseUserAuth();
  const [email, setEmail]= useState("");
  const [password, setPassword]= useState("");
  const [confirmPass, setConfirmPass]= useState("");
  const [error, setError] = useState("")
  const navigate = useNavigate();

  const handleSignup = async (e)=>{
    e.preventDefault();
    if(password !== confirmPass){
      setError("Passwords do not match!")
    }else{
      setError("")
      try{
        await signup( email, password);
        navigate("/login")
      }catch(err){
        setError(err.message)
      }
    }
  }

  return (
    <div className="signup-container">
      <h1 className="signup-heading">Create Account</h1>
      {error && <h3 className="error-message">{error}</h3>}
      <form className="signup-form" onSubmit={handleSignup}>
        
        <label className="input-label" htmlFor="emailInput">Email:
          <input 
            type="text" 
            id="emailInput" 
            placeholder="Enter email address" 
            onChange={(e)=>setEmail(e.target.value)} 
            className="input-field"
          />
        </label>
        
        <label className="input-label" htmlFor="passwordInput">Password:
          <input 
            type="password" 
            id="passwordInput" 
            placeholder="Enter password" 
            onChange={(e)=>setPassword(e.target.value)} 
            className="input-field"
          />
        </label>
  
        <label className="input-label" htmlFor="confirmpassInput">Confirm Password:
          <input 
            type="password" 
            id="confirmpassInput" 
            placeholder="Enter password confirmation" 
            onChange={(e)=>setConfirmPass(e.target.value)} 
            className="input-field"
          />
        </label>
        
        <button type="submit" className="submit-button">Sign up</button>
      </form>
      <p className="login-prompt">
        Already have an account? 
        <Link to="/login" className="login-link">
          <button className="login-button">Log in</button>
        </Link>
      </p>
    </div>
  );
  
}

export default Signup