const { randomUUID } = require("crypto");
const User = require("../model/User");
const Device = require("../model/Device");
const SessionUUID = require("../model/SessionUUID");

async function ProcessService(visitorID, UUID, deviceId) {
  console.log("Processing data in ProcessService...");
  console.log("Visitor ID:", visitorID);
  console.log("UUID:", UUID);
  console.log("Device ID:", deviceId);

  try {
    //create a new user
    const user = await User.create({
      nameHash: visitorID,
    });

    //create a new device
    const device = await Device.create({
      userID: user._id,
      fingerprintHash: deviceId,
    });

    //create a Session linked to both user and device
    const session = await SessionUUID.create({
      userID: user._id,
      deviceID: device._id,
      UUID: UUID,
      lastSeen: new Date(),
    });

    return {
      userID: user.userID,
      userObjectId: user._id,
      deviceID: device.deviceID,
      deviceObjectId: device._id,
      sessionUUID: session.sessionUUID,
    };
  } catch (err) {
    console.error("Error in ProcessService:", err);
    throw err;
  }
}

module.exports = ProcessService;
