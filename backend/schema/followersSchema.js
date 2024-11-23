const mongoose = require('mongoose');

const followerSchema = new mongoose.Schema({
    follower_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    followed_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    created_at: { type: Date, default: Date.now }
  });
  
//   const Follower = mongoose.model('Follower', followerSchema);
  module.exports = mongoose.model('Follower', followerSchema);
  