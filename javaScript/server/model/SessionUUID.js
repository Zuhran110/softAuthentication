const mongoose = require("mongoose");

const SessionUUIDSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deviceID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true,
  },
  UUID: {
    type: String,
    required: true,
    unique: true,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SessionUUID", SessionUUIDSchema);
