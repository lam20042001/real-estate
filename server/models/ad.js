import { mongoose, Schema, ObjectId } from "mongoose";
const schema = new Schema(
    {
        photos: [{}],
        price: { type: Number},
        address: { type: String, required: true },
        bedrooms: Number,
        bathrooms: Number,
        landsize: String,
        title: {
            type: String,
            maxLength: 255,
        },
        slug: {
            type: String,
            lowercase: true,
            unique: true,
        },
        description: {},
        postedBy: { type: ObjectId, ref: "User" },
        sold: { type: Boolean, default: false },
        action: {
            type: String,
            default: "sell",
        },
        views: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);
export default mongoose.model("Ad", schema);