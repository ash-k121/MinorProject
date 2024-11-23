const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message_text: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    is_read: { type: Boolean, default: false }
  });
  
// const Message = mongoose.model('Message', messageSchema);
module.exports = mongoose.model('Message', messageSchema);
  