"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Pencil, Trash2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/spinner";
import TambahPerawat from "@/components/form-tambah-perawat";

// ----------- TYPE -----------------
type Perawat = {
    id: number;
    nama: string;
    departemen: string | null;
    createdAt: string;
};
// -----------------------------------

export default function Page() {
    const router = useRouter();
    const [perawat, setPerawat] = useState<Perawat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // --- STATE UNTUK SEARCH ---
    const [search, setSearch] = useState<string>("");

    // FETCH DATA
    useEffect(() => {
        async function fetchPerawat() {
            try {
                const res = await fetch("/api/perawat");
                const data = await res.json();
                setPerawat(data);
            } catch (err) {
                console.error("Failed fetch perawat", err);
            } finally {
                setLoading(false);
            }
        }
        fetchPerawat();
    }, []);

    // --- FILTERING DATA BERDASARKAN SEARCH ---
    const filteredPerawat = perawat.filter((p) => {
        const keyword = search.toLowerCase();
        return (
            p.nama.toLowerCase().includes(keyword) ||
            (p.departemen?.toLowerCase() || "").includes(keyword)
        );
    });

    return (
        <div className="p-6 space-y-6">

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Data Perawat</CardTitle>
                        <CardDescription>
                            Kelola daftar perawat yang akan dinilai
                        </CardDescription>
                    </div>

                    <div className="flex justify-between gap-2">
                        <Button variant="secondary" onClick={() => router.back()}>
                            Kembali
                        </Button>
                    </div>

                </CardHeader>
            </Card>

            <TambahPerawat />
            {/* HEADER */}

            {/* SEARCH BOX */}
            <Card>
                <CardContent className="p-4">
                    <Input
                        placeholder="Cari perawat berdasarkan nama atau departemen..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md"
                    />
                </CardContent>
            </Card>

            {/* TABLE */}
            <Card>
                <CardContent className="p-5">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <LoadingSpinner />
                        </div>
                    ) : filteredPerawat.length === 0 ? (
                        <p className="p-4 text-muted-foreground">
                            {search
                                ? "Tidak ada perawat yang cocok dengan pencarian."
                                : "Belum ada data perawat."}
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">ID</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Departemen</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredPerawat.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell>{p.id}</TableCell>
                                        <TableCell>{p.nama}</TableCell>
                                        <TableCell>{p.departemen || "-"}</TableCell>

                                        <TableCell className="text-right space-x-2">
                                            <Link
                                                href={`/data-perawat/${p.id}/edit`}
                                            >
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="gap-1"
                                                >
                                                    <Pencil size={14} /> Edit
                                                </Button>
                                            </Link>

                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="gap-1"
                                                onClick={async () => {
                                                    const confirmDelete = confirm(
                                                        "Yakin ingin menghapus perawat ini?"
                                                    );
                                                    if (!confirmDelete) return;

                                                    await fetch(
                                                        `/api/perawat/${p.id}`,
                                                        { method: "DELETE" }
                                                    );

                                                    setPerawat((prev) =>
                                                        prev.filter(
                                                            (x) => x.id !== p.id
                                                        )
                                                    );
                                                }}
                                            >
                                                <Trash2 size={14} /> Hapus
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
