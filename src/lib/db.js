import mongoose from "mongoose";

const MONGO_URI = process.env.DATABASE_URL;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("MongoDB already connected.");
    return;
  }

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // ✅ Ensure 2dsphere index for geospatial queries
    await mongoose.connection.db.collection("hotels").createIndex({ location: "2dsphere" });
    
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
};

export default connectDB;
