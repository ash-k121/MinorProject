import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from "./landingPage/landing";
import Profile from "./profile/profile";
import Login from './navBar/navbar';
import LoginButton from './login/login.jsx';
import LoadingPage from './loadingPage/loadingPage.jsx';
import Followers from './addtionalPages/followers.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginButton/>}/>
        <Route path="/load" element={<LoadingPage/>}/>
        <Route path="/main" element={<Landing />} /> 
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/followers" element={<Followers/>}/>
      </Routes>
    </Router>
  );
}

export default App;
