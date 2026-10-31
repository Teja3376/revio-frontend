"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMe, useSignOut } from "../api/account";

export function UserMenu() {
  const me = useMe();
  const { signOut } = useSignOut();
  const login = me.data?.githubLogin;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account"
        className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm text-text hover:bg-surface"
      >
        <Avatar className="size-7">
          {me.data?.avatarUrl ? <AvatarImage src={me.data.avatarUrl} alt="" /> : null}
          <AvatarFallback>{login?.charAt(0).toUpperCase() ?? "?"}</AvatarFallback>
        </Avatar>
        <span className="truncate">{login ?? "Account"}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem render={<Link href="/settings" />}>Settings</DropdownMenuItem>
        <DropdownMenuItem onClick={() => void signOut()}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
