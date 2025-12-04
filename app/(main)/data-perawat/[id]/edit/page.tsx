"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Tipe data sesuai Prisma/API
type Perawat = {
    id: number;
    nama: string;
    departemen: string | null;
};

export default function EditPerawatPage() {
    const router = useRouter();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [nama, setNama] = useState("");
    const [departemen, setDepartemen] = useState("");

    const [originalData, setOriginalData] = useState<Perawat | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    // Fetch data perawat berdasarkan ID
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/perawat/${id}`);
                const data: Perawat = await res.json();
                console.log(data)

                setNama(data.nama);
                setDepartemen(data.departemen ?? "");

                setOriginalData(data);
            } catch (err) {
                console.error("Gagal fetch perawat:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setErrorMsg("");

        try {
            const res = await fetch(`/api/perawat/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nama,
                    departemen: departemen || null,
                }),
            });

            const json = await res.json();

            if (!res.ok) {
                setErrorMsg(json.error || "Gagal mengupdate data");
                setSaving(false);
                return;
            }

            router.push("/data-perawat");
        } catch (err) {
            setErrorMsg("Terjadi kesalahan server");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <p className="p-6">Memuat data...</p>;

    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">

            {/* ================= INFO SEBELUM EDIT ================= */}
            {originalData && (
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Data Perawat (Sebelum Edit)</CardTitle>
                        <CardDescription>
                            Berikut adalah data asli sebelum dilakukan perubahan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p><strong>ID:</strong> {originalData.id}</p>
                        <p><strong>Nama:</strong> {originalData.nama}</p>
                        <p>
                            <strong>Departemen:</strong>{" "}
                            {originalData.departemen ?? "-"}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* ================= FORM EDIT ================= */}
            <Card>
                <CardHeader>
                    <CardTitle>Edit Perawat</CardTitle>
                    <CardDescription>
                        Ubah data perawat berdasarkan kebutuhan.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-3">
                            <Label>Nama</Label>
                            <Input
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label>Departemen (opsional)</Label>
                            <Input
                                value={departemen}
                                onChange={(e) => setDepartemen(e.target.value)}
                                placeholder="Contoh: ICU, IGD, Rawat Inap"
                            />
                        </div>

                        {errorMsg && (
                            <p className="text-red-500 text-sm">{errorMsg}</p>
                        )}

                        <div className="flex justify-between pt-4">
                            <Link href="/data-perawat">
                                <Button type="button" variant="outline">
                                    Batal
                                </Button>
                            </Link>

                            <Button type="submit" disabled={saving}>
                                {saving ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
