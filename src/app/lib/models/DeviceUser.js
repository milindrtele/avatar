import mongoose from "mongoose";

const DeviceUserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  location: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.DeviceUser ||
  mongoose.model("DeviceUser", DeviceUserSchema);
