"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        const res = await signIn("credentials", {
            redirect: false,
            username,
            password,
        });

        setLoading(false);

        if (res?.error) {
            setErrorMsg("Username atau password salah.");
            return;
        }

        router.push("/");
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your username to login
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleLogin}>
                        <FieldGroup>
                            {/* USERNAME */}
                            <Field>
                                <FieldLabel htmlFor="username">Username</FieldLabel>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="yourusername"
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

                            {errorMsg && (
                                <p className="text-red-500 text-sm">{errorMsg}</p>
                            )}

                            <Field className="mt-4 flex flex-col gap-2">
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Logging in..." : "Login"}
                                </Button>

                                {/* SOCIAL LOGIN (optional) */}
                                <Button variant="outline" type="button">
                                    Login with Google
                                </Button>

                                <FieldDescription className="text-center">
                                    Don&apos;t have an account?{" "}
                                    <a href="/register" className="underline">
                                        Sign up
                                    </a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
