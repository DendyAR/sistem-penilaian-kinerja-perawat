"use client";

import { useState } from "react";
import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");
        setLoading(true);

        const form = new FormData(e.currentTarget);
        const username = form.get("username") as string;
        const password = form.get("password") as string;

        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            setErrorMsg(data.error || "Gagal membuat akun");
            return;
        }

        setSuccessMsg("Akun berhasil dibuat, mengarahkan ke login...");
        setTimeout(() => router.push("/login"), 1500);
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form onSubmit={handleRegister}>
                <FieldGroup>
                    {/* HEADER */}
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex flex-col items-center gap-2 font-medium">
                            <div className="flex size-8 items-center justify-center rounded-md">
                                <GalleryVerticalEnd className="size-6" />
                            </div>
                        </div>

                        <h1 className="text-xl font-bold">Buat Akun Admin</h1>

                        <FieldDescription>
                            Sudah punya akun? <a href="/login">Login</a>
                        </FieldDescription>
                    </div>

                    {/* USERNAME */}
                    <Field>
                        <FieldLabel htmlFor="username">Username</FieldLabel>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="contoh: admin123"
                            required
                        />
                    </Field>

                    {/* PASSWORD */}
                    <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                        />
                    </Field>

                    {/* ERROR / SUCCESS */}
                    {errorMsg && (
                        <p className="text-red-500 text-sm">{errorMsg}</p>
                    )}

                    {successMsg && (
                        <p className="text-green-600 text-sm">{successMsg}</p>
                    )}

                    {/* SUBMIT BUTTON */}
                    <Field>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Membuat Akun..." : "Daftar"}
                        </Button>
                    </Field>

                    <FieldSeparator>Atau</FieldSeparator>

                    {/* SOCIAL BUTTON (opsional) */}
                    <Field className="grid gap-4 sm:grid-cols-2">
                        <Button variant="outline" type="button">
                            Continue with Apple
                        </Button>

                        <Button variant="outline" type="button">
                            Continue with Google
                        </Button>
                    </Field>
                </FieldGroup>
            </form>

            <FieldDescription className="px-6 text-center">
                Dengan mendaftar, Anda menyetujui{" "}
                <a href="#">Terms of Service</a> dan{" "}
                <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    );
}
