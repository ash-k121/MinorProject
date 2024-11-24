// LoadingPage.jsx
import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoadingPage = () => {
  const { user, isAuthenticated } = useAuth0();
  console.log(user);
  const navigate = useNavigate();

  useEffect(() => {
    const checkOrCreateUser = async () => {
      
        try {
          if (isAuthenticated && user) {
            console.log("sending")
          // Check or create user in the backend
          await axios.post("https://project-social-media-backend.onrender.com/load", {
            email: user.email,
            username: user.nickname,
            profilePicture: user.picture,
          });
          console.log("sent")
          
          // Navigate to main page upon successful user check/create
          navigate("/main");}
          else{
            // Redirect to login page if not authenticated
            navigate("/");
          }
        } catch (error) {
          console.error("Error checking or creating user:", error);
        }
      }
    

    checkOrCreateUser();
  }, [isAuthenticated, user, navigate]);

  return (
    <div>
      <h2>Loading...</h2>
      <p>Verifying your account. Please wait...</p>
    </div>
  );
};

export default LoadingPage;
