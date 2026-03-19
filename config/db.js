import mongoose from "mongoose";
import logger from "../utils/winston.js"
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://032rohitprajapati:rohit032@cluster0.xq7xl9k.mongodb.net/?appName=Cluster0");

        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Database Connection Failed ❌");
        // logger.info("db connect error", error.message);
        console.error(error.message);
        process.exit(1); // app band ho jayega agar DB connect na ho
    }
};

export default connectDB;