import UserModel from "../models/userModel.js";
import MessageModel from "../models/messageModel.js";
import {v2 as cloudinary} from 'cloudinary'
import {io, userSocketMap} from '../server.js'

// Get all users except the current user
export const getUsersForSidebar = async (req, res) => {
    try {
        
        const userId = req.user._id;
        const filteredUsers = await UserModel.find({_id: { $ne:userId }}).select("-password");

        // Count unread messages for each user
        const unseenMessages = []
        const promises = filteredUsers.map(async (user) => {
            const messages = await MessageModel.find({senderId: user._id, receiverId: userId, isSeen: false});
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        })

        await Promise.all(promises);
        res.json({success: true, users: filteredUsers, unseenMessages})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// Get all messages for selected chat user
export const getMessages = async (req, res) => {
    try {
        
        const {id: selectedUserId} = req.params;
        const myId = req.user._id;

        const messages = await MessageModel.find({
            $or: [
                { sender: myId, recipient: selectedUserId },
                { sender: selectedUserId, recipient: myId },
            ]
        })
        await MessageModel.updateMany(
            {sender: selectedUserId, recipient: myId},
            {seen: true}
        );

        res.json({success: true, messages});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// Mark messages as seen
export const markMessagesAsSeen = async (req, res) => {
    try {
        const {id} = req.params;

        await MessageModel.findByIdAndUpdate(id, {seen: true});

        res.json({success: true});

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" })
    }
}

// Send a new message to selected user
export const sendMessage = async (req, res) => {
    try {

        const {text} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        if (!senderId) { return res.status(401).json({ success: false, message: "Unauthorized" }); }

        if (!text && !req.file) {
            return res.status(400).json({ success: false, message: "Message must have text or image" });
        }

        let imageUrl;

        if (req.file) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(req.file.path)
                imageUrl = uploadResponse.secure_url
            } catch (error) {
                console.error("Cloudinary upload failed:", error); 
                return res.status(500).json({ success: false, message: "Image upload failed" });
            }
        }

        const newMessage = new MessageModel({
            sender: senderId,
            recipient: receiverId,
            text,
            image: imageUrl
        })

        await newMessage.save()

        // Emit the new message to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId]
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage)
        }

        res.json({success:true, newMessage})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" })
    }
}