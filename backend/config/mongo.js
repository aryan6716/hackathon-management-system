const mongoose = require('mongoose');

const connectMongo = async () => {
  console.log("DEBUG MONGO_URI:", process.env.MONGO_URI || "UNDEFINED");

  if (!process.env.MONGO_URI) {
    console.warn("⚠️ MONGO_URI is not defined. Skipping MongoDB connection.");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB FULL ERROR:");
    console.error(error);
  }
};

module.exports = { connectMongo };