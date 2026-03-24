import User, { IUser } from "../model/User";
import Device, { IDevice } from "../model/Device";
import SessionUUID, { ISessionUUID } from "../model/SessionUUID";

type ProcessResult = {
  userObjectId:IUser["_id"];
  deviceObjectId:IDevice["_id"];
  sessionUUID:string;
}

const ProcessService=async(visitorID: string, UUID:string, deviceId:string): Promise<ProcessResult> => {
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
      userObjectId: user._id,
      deviceObjectId: device._id,
      sessionUUID: session.UUID,
    };
  } catch (err) {
    console.error("Error in ProcessService:", err);
    throw err;
  }
}

export default ProcessService;
