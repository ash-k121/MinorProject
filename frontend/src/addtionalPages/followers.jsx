import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

export default function Followers() {
  const { user, isAuthenticated } = useAuth0();
  const [followers, setFollowers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      if (isAuthenticated && user) {
        try {
          const userResponse = await axios.get('https://project-social-media-backend.onrender.com/getfollowers', {
            params: { email: user.email } // Send email as a query parameter
          });
          console.log(userResponse);
          setFollowers(userResponse.data.followedUsers || []);
        } catch (error) {
          console.error("Error fetching followers", error);
          setError("Error fetching followers");
        }
      }
    };

    fetchFollowers();
  }, [isAuthenticated, user]);

  return (
    <div>
      <h1>Followers</h1>
      {error ? <p>{error}</p> : null}
      <ul>
          {followers.map((follower) => (
            <li key={follower._id}>
              <img src={follower.profilePicture || "default.png"} alt="Profile" width="30" height="30" />
              <span>{follower.username || "Unknown User"}</span>
    </li>
  ))}
</ul>

    </div>
  );
}
