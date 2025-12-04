"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    const [kriteria, setKriteria] = useState<Kriteria[]>([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [formData, setFormData] = useState<FormData>({ nama: "", bobot: "", jenis: "" });
    const [loading, setLoading] = useState(false); // loading global
    const [loadingId, setLoadingId] = useState<number | null>(null); // loading per row


    // Fetch data kriteria
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
        const fetchData = async () => {
            await loadData();
        };
        fetchData();
    }, []);

    const resetForm = () => {
        setFormData({ nama: "", bobot: "", jenis: "" });
        setEditId(null);
    };

    // Create / Update
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
            setOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setLoadingId(null);
        }
    };

    // Delete
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

    // Load data for editing
    const startEdit = (item: Kriteria) => {
        setEditId(item.id);
        setFormData({
            nama: item.nama,
            bobot: item.bobot.toString(),
            jenis: item.jenis,
        });
        setOpen(true);
    };

    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Kelola Data Kriteria</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* BUTTON TAMBAH */}
                    <div className="flex justify-end mb-4">
                        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
                            <DialogTrigger asChild>
                                <Button disabled={loading}>Tambah Kriteria</Button>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {editId ? "Edit Kriteria" : "Tambah Kriteria"}
                                    </DialogTitle>
                                </DialogHeader>

                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <Label>Nama Kriteria</Label>
                                        <Input
                                            value={formData.nama}
                                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label>Bobot</Label>
                                        <Input
                                            type="number"
                                            value={formData.bobot}
                                            onChange={(e) => setFormData({ ...formData, bobot: e.target.value })}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label>Jenis</Label>
                                        <Select
                                            value={formData.jenis}
                                            onValueChange={(value) => setFormData({ ...formData, jenis: value as JenisKriteria })}
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

                                    <Button className="w-full" onClick={handleSubmit} disabled={loading}>
                                        {loading && editId ? <LoadingSpinner /> : editId ? "Update" : "Simpan"}
                                    </Button>

                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* TABEL */}
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Bobot</TableHead>
                                    <TableHead>Jenis</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {kriteria.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>{item.nama}</TableCell>
                                        <TableCell>{item.bobot}</TableCell>
                                        <TableCell className="capitalize">{item.jenis}</TableCell>
                                        <TableCell className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => startEdit(item)}
                                                disabled={loadingId === item.id}
                                            >
                                                {loadingId === item.id ? <LoadingSpinner /> : "Edit"}
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
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
