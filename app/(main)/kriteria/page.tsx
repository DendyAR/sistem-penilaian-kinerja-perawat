"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { LoadingSpinner } from "@/components/ui/spinner";

type JenisKriteria = "benefit" | "cost";

interface Kriteria {
    id: number;
    nama: string;
    bobot: number;
    jenis: JenisKriteria;
}

interface FormData {
    nama: string;
    bobot: string;
    jenis: JenisKriteria | "";
}

export default function KriteriaPage() {
    const router = useRouter();

    const [kriteria, setKriteria] = useState<Kriteria[]>([]);
    const [editId, setEditId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const [formData, setFormData] = useState<FormData>({
        nama: "",
        bobot: "",
        jenis: "",
    });

    // Fetch Data
    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/kriteria");
            const data: Kriteria[] = await res.json();
            setKriteria(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const resetForm = () => {
        setFormData({ nama: "", bobot: "", jenis: "" });
        setEditId(null);
    };

    const handleSubmit = async () => {
        if (!formData.nama || !formData.bobot || !formData.jenis) return;

        const payload = {
            nama: formData.nama,
            bobot: Number(formData.bobot),
            jenis: formData.jenis,
        };

        setLoading(true);

        try {
            if (editId) {
                setLoadingId(editId);
                await fetch(`/api/kriteria/${editId}`, {
                    method: "PUT",
                    body: JSON.stringify(payload),
                });
            } else {
                await fetch("/api/kriteria", {
                    method: "POST",
                    body: JSON.stringify(payload),
                });
            }

            await loadData();
            resetForm();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setLoadingId(null);
        }
    };

    const deleteItem = async (id: number) => {
        setLoadingId(id);
        try {
            await fetch(`/api/kriteria/${id}`, { method: "DELETE" });
            await loadData();
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingId(null);
        }
    };

    const startEdit = (item: Kriteria) => {
        setEditId(item.id);
        setFormData({
            nama: item.nama,
            bobot: item.bobot.toString(),
            jenis: item.jenis,
        });
    };

    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => router.back()}>
                    ← Kembali
                </Button>
                <h1 className="text-xl font-semibold">Kelola Data Kriteria</h1>
            </div>

            {/* FORM INPUT */}
            <Card>
                <CardHeader>
                    <CardTitle>{editId ? "Edit Kriteria" : "Tambah Kriteria"}</CardTitle>
                    <CardDescription>
                        Isi form berikut untuk menambah atau mengubah data kriteria.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <Label>Nama Kriteria</Label>
                        <Input
                            value={formData.nama}
                            onChange={(e) =>
                                setFormData({ ...formData, nama: e.target.value })
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Bobot</Label>
                        <Input
                            type="number"
                            value={formData.bobot}
                            onChange={(e) =>
                                setFormData({ ...formData, bobot: e.target.value })
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Jenis</Label>
                        <Select
                            value={formData.jenis}
                            onValueChange={(value) =>
                                setFormData({ ...formData, jenis: value as JenisKriteria })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih jenis kriteria" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="benefit">Benefit</SelectItem>
                                <SelectItem value="cost">Cost</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-3">
                        <Button className="w-full" onClick={handleSubmit} disabled={loading}>
                            {loading ? (
                                <LoadingSpinner />
                            ) : editId ? (
                                "Update"
                            ) : (
                                "Simpan"
                            )}
                        </Button>

                        {editId && (
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={resetForm}
                                disabled={loading}
                            >
                                Batal
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* TABLE LIST DATA */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Kriteria</CardTitle>
                    <CardDescription>
                        Semua data kriteria ditampilkan pada tabel berikut.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-14">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Bobot</TableHead>
                                        <TableHead>Jenis</TableHead>
                                        <TableHead className="text-center">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {kriteria.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.nama}</TableCell>
                                            <TableCell>{item.bobot}</TableCell>
                                            <TableCell className="capitalize">{item.jenis}</TableCell>

                                            <TableCell className="flex justify-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => startEdit(item)}
                                                    disabled={loadingId === item.id}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => deleteItem(item.id)}
                                                    disabled={loadingId === item.id}
                                                >
                                                    {loadingId === item.id ? <LoadingSpinner /> : "Hapus"}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
