const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nameHash: {
    type: String,
    required: true,
  },
  nameLookup: {
    type: String,
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  linkedCode: {
    type: String,
    unique: true,
    sparse: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
