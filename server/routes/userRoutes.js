import express from 'express';
import { login, signup, updateProfile, checkAuth } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';
import {upload} from '../middleware/multer.js';

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.get('/check', authUser, checkAuth)
userRouter.post('/update-profile', authUser, upload.single('profilePic'), updateProfile)

export default userRouter;