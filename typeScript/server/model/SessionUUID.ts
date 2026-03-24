import mongoose , { Document, Schema, Types } from "mongoose";

export interface ISessionUUID extends Document{
  deviceID: Types.ObjectId ;
  userID: Types.ObjectId;
  UUID: string;
  createdAt:Date;
  lastSeen: Date;
}

const SessionUUIDSchema : Schema<ISessionUUID>  = new mongoose.Schema({
  deviceID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  UUID: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
});


const SessionUUID = mongoose.model<ISessionUUID>("SessionUUID", SessionUUIDSchema);

export default SessionUUID;