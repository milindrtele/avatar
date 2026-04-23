import mongoose from "mongoose";

const AdminUserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.AdminUser ||
  mongoose.model("AdminUser", AdminUserSchema);
