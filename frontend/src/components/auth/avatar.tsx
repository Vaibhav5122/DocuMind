"use client";

import {
  BadgeCheckIcon,
  BadgeX,
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  Mail,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useCurrentSession, useSignOut } from "@/lib/hooks/auth/useAuth";
import Image from "next/image";
import { NavbarButton } from "../ui/resizable-navbar";

export function DropdownMenuAvatar() {
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

  if (isError || !sessionData?.user) {
    router.replace("/login");
    return null;
  }

  const { user } = sessionData;
  console.log(user.image);

  return (
    <DropdownMenu>
      {user && user.image ? (
        <div>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8 overflow-hidden"
              >
                <div className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full bg-muted border border-input">
                  {user.image && user.image.trim() !== "" ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User avatar"}
                      width={32}
                      height={32}
                      className="aspect-square h-full w-full object-cover"
                      priority
                    />
                  ) : (
                    // Manually render text fallback only when there is no user image string available
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      {user.name
                        ? user.name.substring(0, 2).toUpperCase()
                        : "LR"}
                    </div>
                  )}
                </div>
              </Button>
            }
          />

          <DropdownMenuContent align="end" className={"w-auto"}>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User />
                {user.name}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail />
                {user.email}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {user.emailVerified ? (
                  <span className="flex gap-1.5 items-center">
                    {" "}
                    <BadgeCheckIcon /> Verified
                  </span>
                ) : (
                  <span className="flex gap-1.5 items-center">
                    {" "}
                    <BadgeX /> Not Verified
                  </span>
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className={"cursor-pointer"}
              disabled={loggingOut}
              onClick={() =>
                logout(undefined, {
                  onSuccess: () => router.push("/login"),
                })
              }
            >
              <LogOutIcon />
              {loggingOut ? "Signing out..." : "Sign Out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </div>
      ) : (
        <NavbarButton variant="secondary">Login</NavbarButton>
      )}
    </DropdownMenu>
  );
}
