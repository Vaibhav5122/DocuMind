"use client";

import { BadgeCheckIcon, BadgeX, LogOutIcon, Mail, User } from "lucide-react";

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
import Link from "next/link";

export function DropdownMenuAvatar() {
  const router = useRouter();
  const { data: sessionData, isLoading } = useCurrentSession();
  const { mutate: logout, isPending: loggingOut } = useSignOut();

  if (isLoading) {
    return (
      <div className="h-8 w-8 rounded-full bg-muted animate-pulse border border-input" />
    );
  }

  const user = sessionData?.user;

  if (!user) {
    return (
      <Link href="/login">
        <NavbarButton variant="secondary">Login</NavbarButton>
      </Link>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <DropdownMenu>
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
                  {initials}
                </div>
              )}
            </div>
          </Button>
        }
      />

      <DropdownMenuContent align="end" className={"w-auto"}>
        <DropdownMenuGroup>
          <DropdownMenuItem className="gap-2 font-medium">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{user.name}</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="truncate text-xs">{user.email}</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="gap-2 text-xs">
            {user.emailVerified ? (
              <span className="flex gap-1.5 items-center text-emerald-600">
                <BadgeCheckIcon className="h-4 w-4" /> Verified
              </span>
            ) : (
              <span className="flex gap-1.5 items-center text-amber-600">
                <BadgeX className="h-4 w-4" /> Unverified
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
          <LogOutIcon className="h-4 w-4" />
          {loggingOut ? "Signing out..." : "Sign Out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
