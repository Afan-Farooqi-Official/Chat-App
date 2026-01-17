import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    image: { type: String },
    seen: { type: Boolean, default: false }
}, {timestamps: true});

const MessageModel = mongoose.model('Message', messageSchema);

export default MessageModel;