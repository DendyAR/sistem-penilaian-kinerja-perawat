"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export default function Navbar() {

    const { data: session } = useSession();


    const initials =
        session?.user?.name
            ?.split(" ")
            .map((n) => n[0])
            .join("") ?? "A";

    return (
        <nav className="w-full border-b bg-background sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

                {/* LEFT: LOGO */}
                <Link href="/" className="text-xl font-bold">
                    SPK Perawat
                </Link>

                {/* RIGHT SECTION */}
                <div className="flex items-center gap-3">

                    {/* USER DROPDOWN */}
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar className="cursor-pointer">
                                <AvatarImage src="/avatar.png" />
                                <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56 mr-4">
                            <DropdownMenuLabel>{session?.user?.username}</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem asChild>
                                <Link href="/profile">Profile</Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                className="text-red-600 cursor-pointer"
                                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                            >
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
}
