import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const isAuth = cookieStore.get("auth");

  if (isAuth) {
    redirect("/avatar");
  } else {
    redirect("/login");
  }

  return null;
}
