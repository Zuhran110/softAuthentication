const User = require("../model/User");
const Device = require("../model/Device");
const SessionUUID = require("../model/SessionUUID");

async function ProcessService(nameHash, nameLookup, UUID, fingerprintHash) {
  try {
    const user = await User.create({
      nameHash,
      nameLookup,
    });

    const device = await Device.create({
      userID: user._id,
      fingerprintHash,
    });

    const session = await SessionUUID.create({
      userID: user._id,
      deviceID: device._id,
      UUID: UUID,
      lastSeen: new Date(),
    });

    return {
      userObjectId: user._id,
      deviceObjectId: device._id,
      sessionUUID: session.UUID,
    };
  } catch (err) {
    console.error("Error in ProcessService:", err);
    throw err;
  }
}

module.exports = ProcessService;
