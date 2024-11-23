import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import './login.css'
import bgimage from'../assets/bg.jpg'
import logo from '../assets/logo.png';
const LoginButton = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();
  console.log(user);

  return (
    <div className="login-page">
      <div className="login-left">
        <h2>Welcome to Engage <img className="logo-image" src={logo}/></h2>
        <p>Sign into your account</p>
        <button onClick={() => loginWithRedirect({ prompt: 'login' })}>Log In</button>
        {isAuthenticated ? navigate("/load") : null}
      </div>
      <div className="login-right">
        {/* <img src={bgimage} alt="Login Illustration" /> */}
      </div>
    </div>
    
  );
};

export default LoginButton;
