import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import './profile.css';
import LogoutButton from "../login/logout";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [bio, setBio] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [visibility, setVisibility] = useState("friends");
  const [posts, setPosts] = useState([]);
  const [editPost, setEditPost] = useState(null); // For modal content editing
  const [bioUpdateStatus, setBioUpdateStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && user) {
        try {
          const userResponse = await axios.post("http://localhost:5170/api/users/check", {
            email: user.email,
            name: user.name,
            picture: user.picture,
          });
          setUserData(userResponse.data);
          setBio(userResponse.data.bio);

          const postsResponse = await axios.get(`http://localhost:5170/api/posts/user/${userResponse.data._id}`);
          setPosts(postsResponse.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [isAuthenticated, user]);

  const handleBioChange = async () => {
    if (!userData) {
      setBioUpdateStatus("User data not available. Please try again later.");
      return;
    }
    try {
      await axios.put(`http://localhost:5170/api/users/${userData._id}/update-bio`, { bio });
      setBioUpdateStatus("Bio updated successfully!");
    } catch (error) {
      console.error("Error updating bio:", error);
      setBioUpdateStatus("Error updating bio. Please try again.");
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPost = {
        user_id: userData._id,
        content: newPostContent,
        visibility,
      };
      const response = await axios.post("http://localhost:5170/api/posts/create", newPost);
      setPosts([response.data, ...posts]);
      setNewPostContent("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleEditPost = (post) => {
    setEditPost(post); // Opens modal for editing
  };

  const handleUpdatePost = async () => {
    try {
      const response = await axios.put(`http://localhost:5170/edit/${editPost._id}`, {
        content: editPost.content,
        visibility: editPost.visibility,
      });
      setPosts(posts.map(post => post._id === editPost._id ? response.data : post));
      setEditPost(null); // Close modal
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`http://localhost:5170/delete/${postId}`);
        setPosts(posts.filter(post => post._id !== postId));
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  if (!isAuthenticated) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-image">
          {user.picture ? (
            <img src={user.picture} alt="User Profile" />
          ) : (
            <img src="./profile.png" alt="Default Profile" />
          )}
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p>Email: {user.email}</p>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Edit your bio" />
          <button onClick={handleBioChange}>Save Bio</button>
          {bioUpdateStatus && <p className="status-message">{bioUpdateStatus}</p>}
        </div>
      </div>

      <div className="new-post-section">
        <h3>Create a New Post</h3>
        <form onSubmit={handlePostSubmit}>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="What's on your mind?"
            required
          />
          <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
            <option value="friends">Friends</option>
            <option value="public">Public</option>
          </select>
          <button type="submit">Post</button>
        </form>
      </div>

      <div className="posts-section">
        <h3>Your Posts</h3>
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post._id} className="post-card">
              <h4>{post.content}</h4>
              <p>Visibility: {post.visibility}</p>
              <p>Posted on: {new Date(post.created_at).toLocaleString()}</p>
              <button onClick={() => handleEditPost(post)}>Edit</button>
              <button onClick={() => handleDeletePost(post._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>

      {editPost && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Post</h3>
            <textarea
              value={editPost.content}
              onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
              placeholder="Edit your post content"
            />
            <select
              value={editPost.visibility}
              onChange={(e) => setEditPost({ ...editPost, visibility: e.target.value })}
            >
              <option value="friends">Friends</option>
              <option value="public">Public</option>
            </select>
            <button onClick={handleUpdatePost}>Save Changes</button>
            <button onClick={() => setEditPost(null)}>Cancel</button>
          </div>
        </div>
      )}

      <LogoutButton />
    </div>
  );
};

export default Profile;
