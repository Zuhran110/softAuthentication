import { Request, Response } from "express";
import crypto from "crypto";
import User from "../model/User";
import Device from "../model/Device";
import SessionUUID from "../model/SessionUUID";
import GenerateUUIDService from "../services/GenerateUUID.service";

async function LinkCodeController(req: Request, res: Response): Promise<void> {
  try {
    const { linkCode, deviceId } = req.body;

    if (!linkCode || !deviceId) {
      res.status(400).json({ message: "Link code and device ID are required" });
      return;
    }

    const user = await User.findOne({ linkedCode: linkCode });
    if (!user) {
      res.status(404).json({ message: "Invalid code" });
      return;
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

    res.status(200).json({ message: "Authenticated successfully", uuid });
  } catch (err) {
    console.error("LinkCodeController error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export default LinkCodeController;
