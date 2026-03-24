const SessionUUID = require("../model/SessionUUID");
const User = require("../model/User");
const linkCodeGenerator = require("../utility/linkCodeGenerator.utility");

async function GenerateCodeController(req, res) {
  try {
    const { uuid } = req.body;

    if (!uuid) {
      return res.status(400).json({ message: "UUID is required" });
    }

    const session = await SessionUUID.findOne({ UUID: uuid });
    if (!session) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(session.userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.linkedCode) {
      return res.status(200).json({ linkCode: user.linkedCode });
    }

    const code = await linkCodeGenerator();
    await User.findByIdAndUpdate(user._id, { linkedCode: code });

    return res.status(200).json({ linkCode: code });
  } catch (err) {
    console.error("GenerateCodeController error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = GenerateCodeController;
