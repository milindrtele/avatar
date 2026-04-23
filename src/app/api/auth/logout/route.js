import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("auth");
  res.cookies.delete("role");
  res.cookies.delete("username");
  return res;
}
