import { Schema } from "mongoose";
import mongoose from "mongoose";
import Review from "./review.js";

const ListingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        // type: String,
        // default: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60",
        // set: (v) => v === "" ? "https://static.vecteezy.com/system/resources/thumbnails/025/189/222/small_2x/vibrant-raindrop-sphere-reflects-nature-beauty-in-abstract-water-pattern-generated-by-ai-free-photo.jpg" : v,
        url: String,
        filename: String
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    geometry: {
        lat: Number,
        lng: Number,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",

        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }

});

ListingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", ListingSchema);

export default Listing;