import { Request, Response } from "express";
import SessionUUID from "../model/SessionUUID";
import User from "../model/User";
import linkCodeGenerator from "../utility/linkCodeGenerator.utility";

async function GenerateCodeController(req: Request, res: Response): Promise<void> {
  try {
    const { uuid } = req.body;

    if (!uuid) {
      res.status(400).json({ message: "UUID is required" });
      return;
    }

    const session = await SessionUUID.findOne({ UUID: uuid });
    if (!session) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const user = await User.findById(session.userID);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.linkedCode) {
      res.status(200).json({ linkCode: user.linkedCode });
      return;
    }

    const code = await linkCodeGenerator();
    await User.findByIdAndUpdate(user._id, { linkedCode: code });

    res.status(200).json({ linkCode: code });
  } catch (err) {
    console.error("GenerateCodeController error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export default GenerateCodeController;
