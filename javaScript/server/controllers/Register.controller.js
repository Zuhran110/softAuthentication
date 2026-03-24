const bcrypt = require("bcrypt");
const GenerateUUIDService = require("../services/GenerateUUID.service");
const ProcessService = require("../services/Process.service");
const SessionUUID = require("../model/SessionUUID");
const User = require("../model/User");
const Device = require("../model/Device");

async function RegisterController(req, res) {
  try {
    const { firstName, deviceId, uuid } = req.body;
    console.log("POST /api/register body:", req.body);

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
      console.log("UUID login attempt:", uuid);
      const session = await SessionUUID.findOneAndUpdate(
        { UUID: uuid },
        { $set: { lastSeen: new Date() } },
        { returnDocument: "after" },
      );
      if (!session) {
        console.log("No session found for UUID:", uuid);
        return res.status(400).json({ message: "Invalid or expired UUID" });
      }

      console.log("Session found for UUID:", uuid);

      return res
        .status(200)
        .json({ message: "welcome back", uuid: session.UUID });
    }
    async function nameAuth() {
      if (validName) {
        const allUsers = await User.find();
        let matchedUser = null;
        for (const user of allUsers) {
          const isMatch = await bcrypt.compare(firstName, user.nameHash);
          if (isMatch) {
            matchedUser = user;
            break;
          }
        }
        if (matchedUser) {
          const session = await SessionUUID.findOne({
            userID: matchedUser._id,
          });
          if (session) {
            res
              .status(200)
              .json({ message: "welcome back", uuid: session.UUID });
            return true;
          }
        }
      }
    }

    if (validDeviceId) {
      const allFingerprint = await Device.find();
      let matchedDevice = null;
      for (const device of allFingerprint) {
        if (device.fingerprintHash === deviceId) {
          matchedDevice = device;
          break;
        }
      }
      if (matchedDevice) {
        const nameMatched = await nameAuth();
        if (!nameMatched) {
          return res.status(401).json({ message: "Name does not match" });
        }
        return;
      }
    }

    console.log("New registration attempt:", { firstName, deviceId });

    if (!validName || !validDeviceId) {
      return res
        .status(400)
        .json({ message: "Name and device ID are required" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedName = bcrypt.hashSync(firstName, salt);
    const sessionUUID = GenerateUUIDService();

    console.log("Generated UUID:", sessionUUID);

    await ProcessService(hashedName, sessionUUID, deviceId);
    console.log("User, device, and session created successfully");

    return res
      .status(200)
      .json({ message: "Registered Successfully", uuid: sessionUUID });
  } catch (err) {
    console.error("RegisterController error:", err);
    return res.status(500).json({ message: "internal server error" });
  }
}

module.exports = RegisterController;
