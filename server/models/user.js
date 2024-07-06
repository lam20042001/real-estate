import mongoose, { Model, Schema, ObjectId } from "mongoose";
const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    name: {
        type: String,
        trim: true,
        default: ''
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        maxlength: 200,
    },
    address: {
        type: String,
        default: ''
    },
    company: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    photo: {},
    role: {
        type: [String],
        default: ['Buyer'],
        enum: ['Buyer', 'Seller', 'Admin']
    },
    enquiredProperties: {
        type: [ObjectId],
        ref: 'Ad'
    },
    wishlist: {
        type: [ObjectId],
        ref: 'Ad'
    },
    resetCode: {
        type: String,
    },

}, { timeStamps: true });
export default mongoose.model('User', userSchema);
