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
  linkedCode:{
    type: String,
    unique: true,
    sparse: true,
  }
});

module.exports = mongoose.model("User", User);
