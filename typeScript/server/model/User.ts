import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  nameHash: string;
  createdAt: Date;
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
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
