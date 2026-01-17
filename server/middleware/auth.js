import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';

const authUser = async (req, res, next) => {
    try {

        const token = req.headers.token;
        if (!token) {
            return res.json({success: false, message: 'Not Authorized, Login Again'})
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(token_decode.userId).select('-password');
        if (!user) {
            return res.json({success: false, message: 'Not Authorized, Login Again'})
        }

        req.user = user;
        
        next();
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

export default authUser;