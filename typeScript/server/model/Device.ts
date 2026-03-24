import mongoose, { Document, Schema, Types } from "mongoose";

export interface IDevice extends Document{
  userID: Types.ObjectId;
  fingerprintHash: string;
  firstSeen: Date;
}

const DeviceSchema: Schema<IDevice> = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fingerprintHash: {
    type: String,
    required: true,
  },
  firstSeen: {
    type: Date,
    default: Date.now,
  },
});


const Device = mongoose.model<IDevice>("Device", DeviceSchema);

export default Device;