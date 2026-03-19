import mongoose from "mongoose";
import Listing from "./models/listing.js";
import { listings } from "./sampleData.js"


const main = async () => {
    await mongoose.connect("mongodb://localhost:27017/airbnb")

};


main().then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
});
const listing = listings.map((obj) => ({ ...obj, owner: '69ba53354a401e81a5655600' }));
Listing.insertMany(listing);