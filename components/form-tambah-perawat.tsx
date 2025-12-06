"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

export default function TambahPerawat() {
    const router = useRouter();

    const [nama, setNama] = useState<string>("");
    const [departemen, setDepartemen] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [successMsg, setSuccessMsg] = useState<string>("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        const res = await fetch("/api/perawat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nama,
                departemen: departemen || null,
            }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            setErrorMsg(data.error || "Gagal menambahkan perawat");
            return;
        }

        setSuccessMsg("Berhasil menambahkan perawat!");

        setTimeout(() => {
            router.push("/data-perawat");
        }, 1200);
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Tambah Perawat</CardTitle>
                    <CardDescription>
                        Masukkan data perawat baru untuk keperluan penilaian
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FieldGroup>
                            {/* NAMA */}
                            <Field>
                                <FieldLabel htmlFor="nama">Nama Perawat</FieldLabel>
                                <Input
                                    id="nama"
                                    required
                                    placeholder="Masukkan nama perawat"
                                    value={nama}
                                    onChange={(e) => setNama(e.target.value)}
                                />
                            </Field>

                            {/* DEPARTEMEN */}
                            <Field>
                                <FieldLabel htmlFor="departemen">Departemen</FieldLabel>
                                <Input
                                    id="departemen"
                                    placeholder="Contoh: IGD, ICU, Rawat Inap"
                                    value={departemen}
                                    onChange={(e) => setDepartemen(e.target.value)}
                                />
                            </Field>

                            {/* PESAN ERROR */}
                            {errorMsg && (
                                <p className="text-sm text-red-500">{errorMsg}</p>
                            )}

                            {/* PESAN BERHASIL */}
                            {successMsg && (
                                <p className="text-sm text-green-600">{successMsg}</p>
                            )}

                            <Button type="submit" disabled={loading}>
                                {loading ? "Menyimpan..." : "Simpan Perawat"}
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
