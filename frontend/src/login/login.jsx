import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import './login.css'
import logo from '../assets/logo.png';
const LoginButton = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();
  console.log(user);

  return (
    <div className="login-page">
  <div className="login-left">
    <h2 className="typing-text">
      Welcome to Engage !
    </h2>
    <img className="logo-image animated-logo" src={logo} alt="Logo" />
    <p>Sign into your account</p>
    <button onClick={() => loginWithRedirect({ prompt: 'login' })}>Sign Up</button>
    {isAuthenticated ? navigate("/load") : null}
  </div>
  <div className="login-right">
    {/* Optional background image */}
  </div>
</div>

    
  );
};

export default LoginButton;
