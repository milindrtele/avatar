import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/lib/db";
import AdminUser from "@/app/lib/models/AdminUser";
import DeviceUser from "@/app/lib/models/DeviceUser";

export async function GET() {
  await connectDB();

  // const adminUsers = await AdminUser.find().select("-password").lean();
  const deviceUsers = await DeviceUser.find().select("-password").lean();

  const users = [
    // ...adminUsers.map((user) => ({ ...user, role: "admin" })),
    ...deviceUsers.map((user) => ({ ...user, role: "device" })),
  ];

  return NextResponse.json(users);
}

export async function POST(req) {
  try {
    const { username, password, location, role } = await req.json();

    await connectDB();

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "admin") {
      const user = await AdminUser.create({
        username,
        password: hashedPassword,
      });
      return NextResponse.json({
        username: user.username,
        role: "admin",
        createdAt: user.createdAt,
      });
    }

    const user = await DeviceUser.create({
      username,
      password: hashedPassword,
      location,
    });

    return NextResponse.json({
      username: user.username,
      role: "device",
      location: user.location,
      createdAt: user.createdAt,
    });
  } catch (err) {
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
