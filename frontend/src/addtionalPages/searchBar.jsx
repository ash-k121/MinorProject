import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./UserSearch.css"; // Importing CSS
import { useNavigate } from "react-router-dom";
import searchIcon from "../addtionalPages/search-icon.png";

const UserSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();
  const searchBoxRef = useRef(null); // Ref for the search box

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5170/search`, {
        params: { username: query },
      });
      setResults(response.data);
      setNotFound(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setNotFound(true);
        setResults([]);
      } else {
        console.error("Error fetching search results:", error);
      }
    }
  };

  const handleClickOutside = (event) => {
    if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
      setResults([]); // Clear the results if clicked outside
      setNotFound(false); // Hide the "not found" message
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="user-search-container" ref={searchBoxRef}>
      <div className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="Enter username"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <img src={searchIcon} className="search-icon" onClick={handleSearch} />
        {/* <button className="search-button" onClick={handleSearch}>Search</button> */}
      </div>
      {notFound && <p className="not-found">No users found</p>}

      <ul className="results-list">
        {results.map((user) => (
          <li
            className="user-card"
            key={user._id}
            onClick={() => {
              navigate("/profile");
            }}
          >
            <img src={user.profilePicture} alt="Profile" className="profile-pic" />
            <div className="user-info">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Bio:</strong> {user.bio}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearch;
