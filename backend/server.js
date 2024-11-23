const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors'); // Import CORS
const path = require('path');
const User = require("./schema/userSchema"); // Import your Mongoose model
const Post= require("./schema/postSchema");
const Follower = require('./schema/followersSchema'); 
const Like=require('./schema/likesSchema')
const app = express();
const port = 5170;

app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Middleware to parse JSON requests
app.use(express.static(path.join(__dirname, 'frontend'))); // Serve static files

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/socialMedia')
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error("Could not connect to MongoDB:", err));

// Fetch users and send as an array
// app.get('/user', async (req, res) => {
//   try {
//     const users = await User.find(); // Fetch all users
//     res.json(users); // Send the array of users as JSON response
//   } catch (error) {
//     console.error("Error fetching users:", error); // Log any error
//     res.status(500).json({ error: 'Server Error' }); // Send a 500 error response
//   }
// });

app.get('/post', async (req, res) => {
  try {
    const posts = await Post.find().populate('user_id'); // Fetch posts with user details
    res.json(posts);
} catch (error) {
    res.status(500).send(error.message);
}
});
// app.js
app.post("/load", async (req, res) => {
  const { email, username, profilePicture } = req.body;
 console.log(email);
  try {
    console.log("Received request with data:", req.body); // Log incoming request data

    // Step 1: Check if user already exists in the database
    let user = await User.findOne({ email });
    console.log("Database lookup complete"); // Log after database lookup

    if (!user) {
      console.log("User not found, creating new user");
      user = new User({ email, username, profilePicture });
      await user.save();
      console.log("New user created:", user);
    } else {
      console.log("User already exists:", user);
    }

    // Return user info to the client
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in check-or-create:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/", async (req, res) => {
  res.send("hello from 5170")
})
app.post("/getUser", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// app.put("/updateBio", async (req, res) => {
//   const { email, bio } = req.body;

//   try {
//     const user = await User.findOneAndUpdate(
//       { email },
//       { bio },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     console.error("Error updating bio:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // Update profile picture
// app.put("/updateProfilePicture", async (req, res) => {
//   const { email, profilePicture } = req.body;

//   try {
//     const user = await User.findOneAndUpdate(
//       { email },
//       { profilePicture },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     console.error("Error updating profile picture:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // Add post with image
// app.post("/addPost", async (req, res) => {
//   const { email, title, content, image, visibility } = req.body;

//   try {
//     // Find the user by email to get their _id
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Create a new post linked to the user_id
//     const newPost = new Post({
//       user_id: user._id, // Link post to the user
//       content: content,  // Set the post content
//       visibility: visibility || "public",  // Default to "public" if not provided
//       created_at: new Date(),
//       updated_at: new Date(),
//     });

//     // Optionally add the image or title if they exist
//     if (title) newPost.title = title;
//     if (image) newPost.image = image;

//     // Save the new post to the Post collection
//     await newPost.save();

//     res.status(200).json(newPost);
//   } catch (error) {
//     console.error("Error adding post:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// Check user existence and fetch user data
app.post("/api/users/check", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user bio
app.put("/api/users/:id/update-bio", async (req, res) => {
  const { id } = req.params;
  const { bio } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, { bio }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating bio:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create a new post
app.post("/api/posts/create", async (req, res) => {
  const { user_id, content, visibility } = req.body;
  try {
    const newPost = new Post({ user_id, content, visibility, created_at: new Date(), updated_at: new Date() });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get posts by user ID
app.get("/api/posts/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const posts = await Post.find({ user_id: userId }).sort({ created_at: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Server error" });
  }
});


app.post('/follow', async (req, res) => {
  const { follower_user_id, followed_user_id } = req.body;

  try {
      const newFollower = new Follower({
          follower_user_id,
          followed_user_id,
          created_at: new Date(),
      });

      await newFollower.save();
      res.status(201).json({ message: 'Followed successfully' });
  } catch (error) {
      console.error('Error following user:', error);
      res.status(500).json({ error: 'Server error' });
  }
});

// Unfollow a user
app.post('/unfollow', async (req, res) => {
  const { follower_user_id, followed_user_id } = req.body;

  try {
      await Follower.deleteOne({
          follower_user_id,
          followed_user_id,
      });

      res.status(200).json({ message: 'Unfollowed successfully' });
  } catch (error) {
      console.error('Error unfollowing user:', error);
      res.status(500).json({ error: 'Server error' });
  }
});

// Get posts from followed users
app.get('/posts/followed/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
      const followedUsers = await Follower.find({ follower_user_id: userId });

      const followedUserIds = followedUsers.map(follower => follower.followed_user_id);
      
      const posts = await Post.find({ user_id: { $in: followedUserIds } }).populate('user_id'); // Populate to get user details
      res.status(200).json(posts);
  } catch (error) {
      console.error('Error fetching followed users posts:', error);
      res.status(500).json({ error: 'Server error' });
  }
});

app.get('/suggest-users', async (req, res) => {
  try {
    const suggestedUsers = await User.aggregate([{ $sample: { size: 6 } }]); // Randomly select 6 users
    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.error("Error fetching suggested users:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post('/followCounts', async (req, res) => {
  const { userId } = req.body;

  try {
    // Count followers (users following the specified user)
    const followersCount = await Follower.countDocuments({ followed_user_id: userId });

    // Count following (users followed by the specified user)
    const followingCount = await Follower.countDocuments({ follower_user_id: userId });

    // Send both counts in the response
    res.status(200).json({ followersCount, followingCount });
  } catch (error) {
    console.error("Error fetching follow counts", error);
    res.status(500).json({ error: "Server error" });
  }
});

// In your backend (e.g., Express app)
app.get("/search", async (req, res) => {
  const { username } = req.query;
  
  try {
    const users = await User.find({ username: { $regex: username, $options: "i" } }).limit(5); // Case-insensitive search

    if (users.length > 0) {
      res.status(200).json(users); // Send matching users as response
    } else {
      res.status(404).json({ message: "No users found" }); // Send "Not found" message if no matches
    }
  } catch (error) {
    console.error("Error in search:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/feed/:email", async (req, res) => {
  const email = req.params.email;

  try {
    // Find the current user by email
    const currentUser = await User.findOne({ email });
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    // Get IDs of users the current user is following
    const following = await Follower.find({ follower_user_id: currentUser._id });
    const followingIds = following.map((follow) => follow.followed_user_id);

    // Find posts by followed users, populate user details
    const posts = await Post.find({
      user_id: { $in: followingIds },
      visibility: { $in: ["public", "friends"] },
    })
      .sort({ created_at: -1 })
      .limit(10)
      .populate('user_id', 'username profilePicture'); // Populate `username` and `profilePicture`

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching feed:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// Check if a post is liked by a user
app.get("/like", async (req, res) => {
  const { postId, userEmail } = req.query;
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const like = await Like.findOne({ post_id: postId, user_id: user._id });
    res.json({ liked: !!like });
  } catch (error) {
    console.error("Error checking like status:", error);
    res.status(500).json({ message: "Error checking like status" });
  }
});

// Route to add a like
app.post("/like", async (req, res) => {
  const { postId, userEmail } = req.body;
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newLike = new Like({
      _id: new mongoose.Types.ObjectId(),
      post_id: postId,
      user_id: user._id,
    });

    await newLike.save();
    res.status(201).json({ message: "Post liked" });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Error liking post" });
  }
});

// Route to remove a like
app.delete("/like/unlike", async (req, res) => {
  const { postId, userEmail } = req.body;
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Like.findOneAndDelete({ post_id: postId, user_id: user._id });
    res.status(200).json({ message: "Post unliked" });
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).json({ message: "Error unliking post" });
  }
});
app.get('/getfollowers', async (req, res) => {
  const { email } = req.query; // Use query parameter to get the email
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find followers where the followed_user_id is the current user's ID
    const followers = await Follower.find({
      followed_user_id: user._id
    }).populate('follower_user_id', 'username profilePicture'); // Include specific fields

    // Format followers data to return only necessary fields
    const followersData = followers.map(follower => ({
      _id: follower.follower_user_id._id,
      username: follower.follower_user_id.username,
      profilePicture: follower.follower_user_id.profilePicture,
    }));

    return res.json({ followedUsers: followersData });
  } catch (error) {
    console.error("Error fetching followers", error);
    res.status(500).json({ message: "Error fetching followers" });
  }
});

// Update post by ID
app.put('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { content, visibility } = req.body;
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { content, visibility, updated_at: Date.now() },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete post by ID
app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});


// // Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

