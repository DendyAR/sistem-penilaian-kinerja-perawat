"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditProfilePage() {
    const { data: session } = useSession();
    const router = useRouter();

    const [username, setUsername] = useState(session?.user.username ?? "");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMsg("");

        const res = await fetch("/api/profile/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                password: password || undefined,
            }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            setError(data.error || "Gagal memperbarui profil.");
            return;
        }

        setMsg("Profil berhasil diperbarui!");
        setTimeout(() => router.push("/profile"), 1200);
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Edit Profil</h1>

            <Card className="max-w-lg">
                <CardHeader>
                    <CardTitle>Perbarui Informasi</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <Label>Username</Label>
                            <Input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label>Password Baru (opsional)</Label>
                            <Input
                                type="password"
                                placeholder="Isi jika ingin mengganti password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}
                        {msg && (
                            <p className="text-green-600 text-sm">{msg}</p>
                        )}

                        <Button type="submit" disabled={loading}>
                            {loading ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            className="ml-2"
                            onClick={() => router.back()}
                        >
                            Batal
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
