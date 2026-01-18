import UserModel from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import {generateToken} from '../lib/utils.js'
import {v2 as cloudinary} from 'cloudinary'

// Signup new user
export const signup = async (req, res) => {
    const {email, fullName, password, bio} = req.body

    try {

        if (!fullName || !email || !password || !bio) {
            return res.json({success: false, message: 'All fields required'})
        }

        const existingUser = await UserModel.findOne({email})
        if (existingUser) {
            return res.json({success: false, message: 'User already exists'})
        }

        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        const newUser = new UserModel({
            fullName,
            email,
            passwordHash,
            bio
        })

        await newUser.save()

        const token = generateToken(newUser._id)
        res.json({success: true, newUser, token, message: 'Account created successfully'})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// Login existing user
export const login = async (req, res) => {
    const {email, password} = req.body
    
    try {

        const user = await UserModel.findOne({email})
        if (!user) {
            return res.json({success: false, message: 'User not found'})
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash)
        if (!isMatch) {
            return res.json({success: false, message: 'Invalid credentials'})
        }

        const token = generateToken(user._id)
        res.json({success: true, user, token, message: 'Login successful'})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// check if user is authenticated
export const checkAuth = async (req, res) => {
    res.json({success: true, user: req.user})
}

// update user profile
export const updateProfile = async (req, res) => {
    try {
        const { bio, fullName } = req.body
        
        const userId = req.user._id
        
        let updatedUser;

        if (!req.file) {
            updatedUser = await UserModel.findByIdAndUpdate(userId, {bio, fullName}, {new: true})
        } else {
            const upload = await cloudinary.uploader.upload(req.file.path)

            updatedUser = await UserModel.findByIdAndUpdate(userId, {
                profilePic: upload.secure_url,
                bio,
                fullName,
            }, {new: true} )
        }

        res.json({success: true, user: updatedUser, message: 'Profile updated successfully'})

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}