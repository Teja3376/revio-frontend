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
        className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[13px] font-medium text-text hover:bg-surface"
      >
        <Avatar className="size-5">
          {me.data?.avatarUrl ? <AvatarImage src={me.data.avatarUrl} alt="" /> : null}
          <AvatarFallback>{login?.charAt(0).toUpperCase() ?? "?"}</AvatarFallback>
        </Avatar>
        <span className="truncate">{login ?? "Account"}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {login ? (
          <DropdownMenuItem
            render={<a href={`https://github.com/${login}`} target="_blank" rel="noreferrer" />}
          >
            GitHub profile
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem render={<Link href="/settings" />}>Settings</DropdownMenuItem>
        <DropdownMenuItem onClick={() => void signOut()}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
