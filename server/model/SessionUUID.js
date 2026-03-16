const mongoose = require("mongoose");

const SessionUUIDSchema = new mongoose.Schema({
  deviceID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  UUID: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SessionUUID", SessionUUIDSchema);
