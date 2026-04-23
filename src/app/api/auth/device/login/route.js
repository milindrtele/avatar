import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/lib/db";
import DeviceUser from "@/app/lib/models/DeviceUser";

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    await connectDB();

    const user = await DeviceUser.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: "Device user not found" },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const res = NextResponse.json({ success: true, role: "device" });
    res.cookies.set("auth", "true");
    res.cookies.set("role", "device");
    res.cookies.set("username", user.username);

    return res;
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
