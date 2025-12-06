"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectTrigger, SelectValue,
    SelectContent, SelectItem
} from "@/components/ui/select";

import {
    Table, TableHeader, TableBody, TableRow,
    TableCell, TableHead
} from "@/components/ui/table";

import { LoadingSpinner } from "@/components/ui/spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Perawat { id: number; nama: string; }
interface Kriteria { id: number; nama: string; }
interface Nilai { id: number; nilai: number; perawat: Perawat; kriteria: Kriteria; }

export default function PenilaianPage() {
    const [perawats, setPerawats] = useState<Perawat[]>([]);
    const [kriterias, setKriterias] = useState<Kriteria[]>([]);
    const [nilaiList, setNilaiList] = useState<Nilai[]>([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState(""); // <-- TAMBAHAN SEARCH

    const [formData, setFormData] = useState({
        perawatId: 0,
        kriteriaId: 0,
        nilai: "",
    });

    // Load data
    const loadData = async () => {
        setLoading(true);
        try {
            const [resPerawat, resKriteria, resNilai] = await Promise.all([
                fetch("/api/perawat"),
                fetch("/api/kriteria"),
                fetch("/api/penilaian"),
            ]);

            setPerawats(await resPerawat.json());
            setKriterias(await resKriteria.json());
            setNilaiList(await resNilai.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    // Submit nilai baru
    const handleSubmit = async () => {
        if (!formData.perawatId || !formData.kriteriaId || !formData.nilai) return;
        setLoading(true);
        try {
            await fetch("/api/penilaian", {
                method: "POST",
                body: JSON.stringify({
                    perawatId: formData.perawatId,
                    kriteriaId: formData.kriteriaId,
                    nilai: Number(formData.nilai)
                }),
            });
            setFormData({ perawatId: 0, kriteriaId: 0, nilai: "" });
            await loadData();
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    // Hapus nilai
    const deleteNilai = async (id: number) => {
        setLoading(true);
        try {
            await fetch(`/api/penilaian/${id}`, { method: "DELETE" });
            await loadData();
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    // FILTER DATA BERDASARKAN SEARCH
    const filteredNilai = nilaiList.filter((n) => {
        const q = search.toLowerCase();
        return (
            n.perawat.nama.toLowerCase().includes(q) ||
            n.kriteria.nama.toLowerCase().includes(q) ||
            n.nilai.toString().includes(q)
        );
    });

    return (
        <div className="p-4 md:p-6 space-y-8">

            {/* FORM INPUT */}
            <Card className="w-full p-2">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Input Nilai Perawat</CardTitle>
                    <CardDescription>Masukkan nilai berdasarkan kriteria yang dipilih.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                    {/* Perawat */}
                    <div className="space-y-1">
                        <Label className="mb-2">Perawat</Label>
                        <Select
                            value={formData.perawatId === 0 ? "" : formData.perawatId.toString()}
                            onValueChange={(v) =>
                                setFormData({ ...formData, perawatId: Number(v) })
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Perawat" />
                            </SelectTrigger>
                            <SelectContent>
                                {perawats.map((p) => (
                                    <SelectItem key={p.id} value={p.id.toString()}>
                                        {p.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Kriteria */}
                    <div className="space-y-1">
                        <Label className="mb-2">Kriteria</Label>
                        <Select
                            value={formData.kriteriaId === 0 ? "" : formData.kriteriaId.toString()}
                            onValueChange={(v) =>
                                setFormData({ ...formData, kriteriaId: Number(v) })
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Kriteria" />
                            </SelectTrigger>
                            <SelectContent>
                                {kriterias.map((k) => (
                                    <SelectItem key={k.id} value={k.id.toString()}>
                                        {k.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Nilai */}
                    <div className="space-y-1">
                        <Label className="mb-2">Nilai</Label>
                        <Input
                            type="number"
                            value={formData.nilai}
                            onChange={(e) => setFormData({ ...formData, nilai: e.target.value })}
                        />
                    </div>

                    <Button onClick={handleSubmit} disabled={loading} className="w-full">
                        {loading ? <LoadingSpinner /> : "Simpan"}
                    </Button>
                </CardContent>
            </Card>

            {/* SEARCH BAR */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Data Penilaian</CardTitle>
                    <CardDescription>Daftar nilai yang telah tersimpan.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center">
                        <Input
                            placeholder="Cari berdasarkan perawat, kriteria, atau nilai..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="max-w-md"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* TABEL PENILAIAN */}
            <Card>
                <CardContent className="p-2">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <Table className="min-w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Perawat</TableHead>
                                        <TableHead>Kriteria</TableHead>
                                        <TableHead>Nilai</TableHead>
                                        <TableHead className="text-center">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredNilai.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-4">
                                                Tidak ada data cocok dengan pencarian.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredNilai.map((n) => (
                                            <TableRow key={n.id}>

                                                <TableCell>{n.id}</TableCell>
                                                <TableCell>{n.perawat.nama}</TableCell>
                                                <TableCell>{n.kriteria.nama}</TableCell>
                                                <TableCell>{n.nilai}</TableCell>

                                                <TableCell className="text-center">
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => deleteNilai(n.id)}
                                                        disabled={loading}
                                                    >
                                                        Hapus
                                                    </Button>
                                                </TableCell>

                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </CardContent>
            </Card>

        </div>

    );
}
