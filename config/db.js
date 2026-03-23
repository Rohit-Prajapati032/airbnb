import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();
const dbUrl = process.env.MONGODB_URL;
// console.log(dbUrl);
const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl);

        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Database Connection Failed ❌");
        // logger.info("db connect error", error.message);
        console.error(error.message);
        process.exit(1); // app band ho jayega agar DB connect na ho
    }
};

export default connectDB;