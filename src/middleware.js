import { NextResponse } from "next/server";

export default function middleware(request) {
  const auth = request.cookies.get("auth");
  const role = request.cookies.get("role");

  const url = request.nextUrl.pathname;

  if (!auth && url.startsWith("/avatar")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    !auth &&
    url.startsWith("/admin") &&
    url !== "/admin/login" &&
    role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}
