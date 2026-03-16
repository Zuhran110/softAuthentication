const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB din't Connect successfully");
    console.error("name", err.name);
    console.error("message", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
