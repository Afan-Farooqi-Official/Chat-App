import express from 'express';
import { getMessages, getUsersForSidebar, markMessagesAsSeen, sendMessage } from '../controllers/messageController.js';
import authUser from '../middleware/auth.js';

const messageRouter = express.Router();

messageRouter.get('/users', authUser, getUsersForSidebar)
messageRouter.get('/:id', authUser, getMessages);
messageRouter.put('/mark/:id', authUser, markMessagesAsSeen);
messageRouter.post('/send/:id', authUser, sendMessage)

export default messageRouter;