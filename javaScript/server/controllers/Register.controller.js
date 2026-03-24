const crypto = require("crypto");
const bcrypt = require("bcrypt");
const GenerateUUIDService = require("../services/GenerateUUID.service");
const ProcessService = require("../services/Process.service");
const SessionUUID = require("../model/SessionUUID");
const User = require("../model/User");
const Device = require("../model/Device");

function hashSHA256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

async function RegisterController(req, res) {
  try {
    const { firstName, deviceId, uuid } = req.body;

    const hasValidUUID =
      typeof uuid === "string" &&
      uuid.trim() !== "" &&
      uuid !== "null" &&
      uuid !== "undefined";

    const validName =
      typeof firstName === "string" &&
      firstName.trim() !== "" &&
      firstName !== "null" &&
      firstName !== "undefined";

    const validDeviceId =
      typeof deviceId === "string" &&
      deviceId.trim() !== "" &&
      deviceId !== "null" &&
      deviceId !== "undefined";

    if (hasValidUUID) {
      const session = await SessionUUID.findOneAndUpdate(
        { UUID: uuid },
        { $set: { lastSeen: new Date() } },
        { returnDocument: "after" },
      );
      if (!session) {
        return res.status(400).json({ message: "Invalid or expired UUID" });
      }
      return res
        .status(200)
        .json({ message: "welcome back", uuid: session.UUID });
    }

    if (validDeviceId) {
      const deviceHash = hashSHA256(deviceId);
      const matchedDevice = await Device.findOne({ fingerprintHash: deviceHash });

      if (matchedDevice) {
        if (!validName) {
          return res.status(400).json({ message: "Name is required" });
        }
        const nameLookup = hashSHA256(firstName.toLowerCase().trim());
        const user = await User.findOne({ nameLookup });

        if (user && await bcrypt.compare(firstName, user.nameHash)) {
          const session = await SessionUUID.findOne({ userID: user._id });
          if (session) {
            return res
              .status(200)
              .json({ message: "welcome back", uuid: session.UUID });
          }
        }
        return res.status(401).json({ message: "Name does not match" });
      }
    }

    if (!validName || !validDeviceId) {
      return res
        .status(400)
        .json({ message: "Name and device ID are required" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedName = bcrypt.hashSync(firstName, salt);
    const nameLookup = hashSHA256(firstName.toLowerCase().trim());
    const deviceHash = hashSHA256(deviceId);
    const sessionUUID = GenerateUUIDService();

    await ProcessService(hashedName, nameLookup, sessionUUID, deviceHash);

    return res
      .status(200)
      .json({ message: "Registered Successfully", uuid: sessionUUID });
  } catch (err) {
    console.error("RegisterController error:", err);
    return res.status(500).json({ message: "internal server error" });
  }
}

module.exports = RegisterController;
