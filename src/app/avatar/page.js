import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/app/lib/db";
import DeviceUser from "@/app/lib/models/DeviceUser";
import AvatarClient from "./AvatarClient";

export default async function AvatarPage() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("auth");
  const username = cookieStore.get("username");

  // Check if auth cookie exists
  if (!auth || !username) {
    redirect("/login");
  }

  // Validate user exists in database
  try {
    await connectDB();
    const user = await DeviceUser.findOne({ username: username.value });

    if (!user) {
      // User not found in database, redirect to login
      // Cookies will be invalidated on next login attempt
      redirect("/login");
    }
  } catch (err) {
    console.error("Error validating user:", err);
    redirect("/login");
  }

  return <AvatarClient />;
}
