const mongoose = require("mongoose");

const User = new mongoose.Schema({
  nameHash: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", User);
