import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';

const authUser = async (req, res, next) => {
    try {

        const token = req.headers.token;
        if (!token) {
            return res.status(401).json({success: false, message: 'No token provided'})
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await UserModel.findById(token_decode.userId).select('-password');
        if (!user) {
            return res.status(401).json({success: false, message: 'Not Authorized, Login Again'})
        }

        req.user = user;
        
        next();
        
    } catch (error) {
        console.log(error);

        // Handle JWT-specific errors
        if (error.name === "JsonWebTokenError") { 
            return res.status(401).json({ success: false, message: "Invalid token" });
        } 
        if (error.name === "TokenExpiredError") { 
            return res.status(401).json({ success: false, message: "Token expired" }); 
        }

        res.status(500).json({ error: "Internal server error" });
    }
}

export default authUser;