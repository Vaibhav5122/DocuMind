"use client";

import { Button } from "@/components/ui/button";
import { useCurrentSession, useSignOut } from "@/lib/hooks/auth/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";

const About = () => {
  const router = useRouter();
  const { data: sessionData, isError, isLoading } = useCurrentSession();
  const { mutate: logout, isPending: loggingOut } = useSignOut();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading user details...
      </div>
    );
  }
  console.log("seesss", sessionData);

  if (isError || !sessionData?.user) {
    router.replace("/login");
    return null;
  }

  const { user } = sessionData;

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        <Button
          variant="destructive"
          disabled={loggingOut}
          onClick={() =>
            logout(undefined, {
              onSuccess: () => router.push("/login"),
            })
          }
        >
          {loggingOut ? "Signing out..." : "Sign Out"}
        </Button>
      </div>

      <div className="rounded-lg border p-6 space-y-3 bg-card">
        <div className="flex justify-between pr-9">
          <h2 className="text-lg font-semibold">Profile Details</h2>
          {user.image && (
            <Image
              className="rounded-full"
              src={user?.image || "/default-avatar.png"}
              width={30}
              height={30}
              alt={user.name || "User avatar"}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-muted-foreground">User ID:</span>
          <span className="font-mono">{user.id}</span>

          <span className="text-muted-foreground">Full Name:</span>
          <span>{user.name}</span>

          <span className="text-muted-foreground">Email Address:</span>
          <span>{user.email}</span>

          <span className="text-muted-foreground">Email Verified:</span>
          <span>{user.emailVerified ? "Verified ✅" : "Unverified ❌"}</span>
        </div>
      </div>
    </div>
  );
};

export default About;
