const User = require("../model/User");

async function linkCodeGenerator() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code;
  let exists = true;

  while (exists) {
    code = "";
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    exists = await User.findOne({ linkedCode: code });
  }

  return code;
}

module.exports = linkCodeGenerator;
