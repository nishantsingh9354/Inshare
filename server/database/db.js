import mongoose from "mongoose";

const DBConnection = async () => {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/inshare';
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error while connecting with the database:', error.message);
    }
}

export default DBConnection;