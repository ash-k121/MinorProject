import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { useAuth0 } from "@auth0/auth0-react";
import UserSearch from '../addtionalPages/searchBar';
import profile from '../assets/default-profile-pic.png'
import './navbar.css'
const Navbar = () => {
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const navigate = useNavigate(); // Get the navigate function
  let userName="";
  isAuthenticated?(userName=user.name):(userName=" ")
  const handleSearch = (e) => {
    e.preventDefault(); 
   
    console.log('Searching for:', searchQuery);
   
  };

  return (
    <div  className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
      <h1><i>Hi {userName} !</i></h1>
      <UserSearch></UserSearch>
      <img onClick={() => navigate('/profile')}className='profile-icon' src={profile}/> 
    </div>
  );
};

export default Navbar;
