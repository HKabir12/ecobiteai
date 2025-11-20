import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/module/user/profile/ProfileForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect("/login");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/me`, {
    method: "GET",
    cache: "no-store",
  });

  const user = await res.json();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
      <ProfileForm user={user} />
    </div>
  );
}
