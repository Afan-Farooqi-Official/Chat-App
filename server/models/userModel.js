import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    fullName: {type: String, required: true},
    passwordHash: {type: String, required: true, minlength: 6},
    profilePic: {type: String, default: ''},
    bio: {type: String},
}, {timestamps: true});

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

export default UserModel;