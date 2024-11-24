import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import "./feed.css";

const Feed = () => {
  const { user, isAuthenticated } = useAuth0();
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`https://project-social-media-backend.onrender.com/feed/${user.email}`);
        setPosts(response.data);

        // Check if each post is liked by the current user
        response.data.forEach(async (post) => {
          const res = await axios.get(`https://project-social-media-backend.onrender.com/like`, {
            params: { postId: post._id, userEmail: user.email },
          });
          setLikedPosts((prev) => ({ ...prev, [post._id]: res.data.liked }));
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    if (isAuthenticated) fetchPosts();
  }, [user, isAuthenticated]);

  const toggleLike = async (postId) => {
    const isLiked = likedPosts[postId];
  
    try {
      const url = `https://project-social-media-backend.onrender.com/like${isLiked ? "/unlike" : ""}`;
      const method = isLiked ? "delete" : "post";
  
      await axios({
        method,
        url,
        data: { postId, userEmail: user.email },
      });
  
      // Toggle like status in local state
      setLikedPosts((prevLikedPosts) => ({
        ...prevLikedPosts,
        [postId]: !isLiked,
      }));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };
  

  return (
    <div className="feed-container">
      <h2>Feed</h2>
      {posts.map((post) => (
        <div key={post._id} className="post-card">
          <div className="post-header">
            <img
              src={post.user_id?.profilePicture || "/default-profile-pic.png"}
              alt="Profile"
              className="profile-icon"
            />
            <span className="username">{post.user_id?.username || "Unknown"}</span>
          </div>
          <p>{post.content}</p>
          <p><small>{new Date(post.created_at).toLocaleString()}</small></p>
          <button
            className={`heart-button ${likedPosts[post._id] ? "liked" : ""}`}
            onClick={() => toggleLike(post._id)}
          >
            ♥
          </button>
        </div>
      ))}
    </div>
  );
};

export default Feed;
