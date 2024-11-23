// src/PostCard.js
import React from 'react';
import './cards.css'; // Create this file for styling

const Card = ({ profilePhoto, name, content }) => {
    return (
        <div className="post-card">
            <div className="profile">
                <img src={profilePhoto} alt="Profile" className="profile-photo" />
                <h3 className="profile-name">{name}</h3>
            </div>
            {/* <img src={postImage} alt="Post" className="post-image" /> */}
            <div className="post-info">
                {/* <div className="likes">
                    <span className="likes-icon">👍</span>
                    <span>{likes} likes</span>
                </div>
                <div className="comments">
                    <span>{comments} comments</span>
                </div> */}
                <div className="content">
                    <span>{content} content</span>
                </div>
            </div>
        </div>
    );
};

export default Card;
