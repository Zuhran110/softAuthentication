import crypto from "crypto";
import User from "../model/User";

async function linkCodeGenerator(): Promise<string> {
  let code: string = "";
  let exists = true;

  while (exists) {
    code = crypto.randomBytes(6).toString("base64url").slice(0, 8);
    exists = !!(await User.findOne({ linkedCode: code }));
  }

  return code;
}

export default linkCodeGenerator;
