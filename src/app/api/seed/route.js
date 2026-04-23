import bcrypt from "bcryptjs";
import { connectDB } from "@/app/lib/db";
import AdminUser from "@/app/lib/models/AdminUser";
import DeviceUser from "@/app/lib/models/DeviceUser";

export async function GET() {
  await connectDB();

  const adminExists = await AdminUser.findOne({ username: "admin" });
  if (!adminExists) {
    const adminPw = await bcrypt.hash("admin123", 10);
    await AdminUser.create({ username: "admin", password: adminPw });
  }

  const deviceExists = await DeviceUser.findOne({ username: "device" });
  if (!deviceExists) {
    const devicePw = await bcrypt.hash("device123", 10);
    await DeviceUser.create({
      username: "device",
      password: devicePw,
      location: "default",
    });
  }

  return new Response("Seed data created");
}
