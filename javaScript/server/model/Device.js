const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fingerprintHash: {
    type: String,
    required: true,
  },
  firstSeen: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Device", DeviceSchema);
