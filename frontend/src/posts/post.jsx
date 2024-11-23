import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import Feed from "../feed/feed";
import './post.css'
export default function Post() {
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && user) {
        try {
          const userResponse = await axios.post("http://localhost:5170/api/users/check", {
            email: user.email
          });

          setUserData(userResponse.data);
          const followed = userResponse.data.followedUsers;
          setFollowedUsers(Array.isArray(followed) ? followed : []);

          if (!Array.isArray(followed) || followed.length === 0) {
            try {
              const suggestedResponse = await axios.get("http://localhost:5170/suggest-users");
              setSuggestedUsers(suggestedResponse.data);
            } catch (suggestedError) {
              console.error("Error fetching suggested users:", suggestedError);
              setError("Could not fetch suggested users.");
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Could not fetch user data.");
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated, user]);

  const handleFollowUser = async (userId) => {
    if (!userData) return;

    const followerUserId = userData._id;

    try {
      await axios.post("http://localhost:5170/follow", {
        follower_user_id: followerUserId,
        followed_user_id: userId,
      });

      alert("You are now following this user!");

      // Find the followed user object from suggested users
      const followedUser = suggestedUsers.find((user) => user._id === userId);

      if (followedUser) {
        // Add the followed user to followedUsers and remove from suggestedUsers
        setFollowedUsers((prevFollowedUsers) => [...prevFollowedUsers, followedUser]);
        setSuggestedUsers((prevSuggestedUsers) =>
          prevSuggestedUsers.filter((user) => user._id !== userId)
        );
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollowUser = async (userId) => {
    if (!userData) return;

    const followerUserId = userData._id;

    try {
      await axios.post("http://localhost:5170/unfollow", {
        follower_user_id: followerUserId,
        followed_user_id: userId,
      });

      alert("You have unfollowed this user!");

      // Remove from followedUsers and add back to suggestedUsers
      setFollowedUsers((prevFollowedUsers) =>
        prevFollowedUsers.filter((user) => user._id !== userId)
      );

      const unfollowedUser = followedUsers.find((user) => user._id === userId);
      if (unfollowedUser) {
        setSuggestedUsers((prevSuggestedUsers) => [...prevSuggestedUsers, unfollowedUser]);
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  if (!isAuthenticated) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className="profile-container">
      <div className="left-section">
            {/* <h2>{user.name}'s Profile</h2> */}

            {error && <p className="error">{error}</p>}

                <div className="followed-users-section" style={{paddingBottom:'1rem'}}>
                  <h3>Followed Users</h3>
                  {followedUsers.length > 0 ? (
                    followedUsers.map((followedUser) => (
                      <div key={followedUser._id}>
                        {followedUser.username}
                        <button onClick={() => handleUnfollowUser(followedUser._id)}>Unfollow</button>
                      </div>
                    ))
                  ) : (
                    <p>You did not follow anyone yet.</p>
                   
                  )}
                </div>

                <div className="suggested-users-section">
                  <h3>Suggested Users to Follow</h3>
                  {suggestedUsers.length > 0 ? (
                    suggestedUsers.map((suggestedUser) => (
                      <div key={suggestedUser._id} className="suggested-user">
                        <span>{suggestedUser.username}</span>
                        <button onClick={() => handleFollowUser(suggestedUser._id)}>Follow</button>
                      </div>
                    ))
                  ) : (
                    <p>No suggested users available.</p>
                  )}
                </div>
      </div>
      <div className="right-section">
        <Feed />
      </div>

     
    </div>
  );
}
