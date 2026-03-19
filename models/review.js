import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    comment: {
        type: String
    },
    create_at: {
        type: Date,
        default: Date.now()
    },
    auther: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;