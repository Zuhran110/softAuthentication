const crypto = require("crypto");
const User = require("../model/User");
const Device = require("../model/Device");
const SessionUUID = require("../model/SessionUUID");
const GenerateUUIDService = require("../services/GenerateUUID.service");

async function LinkCodeController(req, res) {
  try {
    const { linkCode, deviceId } = req.body;

    if (!linkCode || !deviceId) {
      return res.status(400).json({ message: "Link code and device ID are required" });
    }

    const user = await User.findOne({ linkedCode: linkCode });
    if (!user) {
      return res.status(404).json({ message: "Invalid code" });
    }

    const fingerprintHash = crypto.createHash("sha256").update(deviceId).digest("hex");

    const device = await Device.create({
      userID: user._id,
      fingerprintHash,
    });

    const uuid = GenerateUUIDService();
    await SessionUUID.create({
      userID: user._id,
      deviceID: device._id,
      UUID: uuid,
      lastSeen: new Date(),
    });

    return res.status(200).json({ message: "Authenticated successfully", uuid });
  } catch (err) {
    console.error("LinkCodeController error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = LinkCodeController;
