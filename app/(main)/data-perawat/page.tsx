"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Plus, Pencil, Trash2 } from "lucide-react";

// ----------- TYPE SESUAI API PERAWAT / PRISMA -------------
type Perawat = {
    id: number;
    nama: string;
    departemen: string | null;
    createdAt: string;
};
// -----------------------------------------------------------

export default function Page() {
    const [perawat, setPerawat] = useState<Perawat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

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

    return (
        <div className="p-6 space-y-6">
            {/* HEADER */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Data Perawat</CardTitle>
                        <CardDescription>
                            Kelola daftar perawat yang akan dinilai
                        </CardDescription>
                    </div>

                    <Link href="/data-perawat/tambah">
                        <Button className="gap-2">
                            <Plus size={16} />
                            Tambah Perawat
                        </Button>
                    </Link>
                </CardHeader>
            </Card>

            {/* TABLE */}
            <Card>
                <CardContent className="p-5">
                    {loading ? (
                        <p className="p-4">Memuat data...</p>
                    ) : perawat.length === 0 ? (
                        <p className="p-4 text-muted-foreground">
                            Belum ada data perawat.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">ID</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Departemen</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {perawat.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell>{p.id}</TableCell>
                                        <TableCell>{p.nama}</TableCell>
                                        <TableCell>{p.departemen || "-"}</TableCell>

                                        <TableCell className="text-right space-x-2">
                                            <Link href={`/data-perawat/${p.id}/edit`}>
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
                                                        prev.filter((x) => x.id !== p.id)
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
