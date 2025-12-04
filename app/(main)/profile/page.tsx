"use client";

import { useSession, signOut } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { data: session } = useSession();
    const router = useRouter();

    if (!session) {
        return <p className="p-4">Loading...</p>;
    }

    const { user } = session;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Profil Admin</h1>

            <Card className="max-w-lg">
                <CardHeader>
                    <CardTitle>Informasi Akun</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div>
                        <p className="font-medium text-sm text-muted-foreground">
                            Username
                        </p>
                        <p className="text-lg">{user.username}</p>
                    </div>

                    <div>
                        <p className="font-medium text-sm text-muted-foreground">
                            Role
                        </p>
                        <p className="text-lg capitalize">{user.role}</p>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button onClick={() => router.push("/profile/edit")}>
                            Edit Profil
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={() => signOut({ callbackUrl: "/login" })}
                        >
                            Logout
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
