const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: true,
    unique: true, // Ensures that no two users can have the same username
    trim: true,   // Removes whitespace from both ends
  },
  email: {
    type: String,
    // required: true,
    unique: true, // Ensures that no two users can have the same email
    lowercase: true, // Converts email to lowercase
    trim: true,
  },
  password: {
    type: String,
    // required: true,
    minlength: 6, // Minimum length of password
  },
  profilePicture: {
    type: String,
    default: 'pic', // Default profile picture
  },
  bio: {
    type: String,
    maxlength: 160, // Maximum length for the bio
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to the current date
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the updatedAt field before saving
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;
