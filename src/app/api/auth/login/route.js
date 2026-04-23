import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Use /api/auth/admin/login or /api/auth/device/login",
    },
    { status: 404 },
  );
}
