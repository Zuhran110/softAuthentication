const crypto = require("crypto");
const User = require("../model/User");

async function linkCodeGenerator() {
  let code;
  let exists = true;

  while (exists) {
    code = crypto.randomBytes(6).toString("base64url").slice(0, 8);
    exists = await User.findOne({ linkedCode: code });
  }

  return code;
}

module.exports = linkCodeGenerator;
