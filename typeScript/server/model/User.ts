import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  nameHash: string;
  createdAt: Date;
  linkedCode?: string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  nameHash: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  linkedCode: {
    type: String,
    unique: true,
    sparse: true,
  },
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
