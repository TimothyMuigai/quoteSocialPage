import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { UseUserAuth } from "../context/UserAuthContext";
function Login() {
  const { login } = UseUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
 
  const handleLogin =async (e)=>{
    e.preventDefault();
    setError("");
    try{
      await login(email,password)
      navigate('/QuoteAccount')
    }catch(err){
      setError(err.message)
      
    }
  }
  return (
    <div className="login-container">
      <h1 className="login-heading">Login</h1>
      {error && <h3 className="error-message">{error}</h3>}
      <form className="login-form" onSubmit={handleLogin}>
        
        <label className="input-label" htmlFor="emailtxt">Email:
          <input 
            type="email" 
            id="emailtxt" 
            placeholder="Enter Email address" 
            onChange={(e)=>setEmail(e.target.value)} 
            className="input-field"
          />
        </label>
  
        <label className="input-label" htmlFor="password">Password:
          <input 
            type="password" 
            id="password" 
            placeholder="Enter password" 
            onChange={(e)=>setPassword(e.target.value)} 
            className="input-field"
          />
        </label>
  
        <button type="submit" className="submit-button">Log in</button>
      </form>
      <p className="signup-prompt">
        Don&apos;t have an account? 
        <Link to="/sign-up" className="signup-link">
          <button className="signup-button">Sign up</button>
        </Link>
      </p>
    </div>
  );
  
}

export default Login