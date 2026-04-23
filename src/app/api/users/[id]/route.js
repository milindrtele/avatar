import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/lib/db";
import AdminUser from "@/app/lib/models/AdminUser";
import DeviceUser from "@/app/lib/models/DeviceUser";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    await connectDB();

    const hashedPassword = await bcrypt.hash(password, 10);

    // Try to find and update in AdminUser first
    let user = await AdminUser.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true },
    );

    if (!user) {
      // If not found, try DeviceUser
      user = await DeviceUser.findByIdAndUpdate(
        id,
        { password: hashedPassword },
        { new: true },
      );
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await connectDB();

    // Try to delete from AdminUser first
    let user = await AdminUser.findByIdAndDelete(id);

    if (!user) {
      // If not found, try DeviceUser
      user = await DeviceUser.findByIdAndDelete(id);
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
