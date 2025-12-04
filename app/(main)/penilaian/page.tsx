"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/spinner";

interface Perawat { id: number; nama: string; }
interface Kriteria { id: number; nama: string; }
interface Nilai { id: number; nilai: number; perawat: Perawat; kriteria: Kriteria; }

export default function PenilaianPage() {
    const [perawats, setPerawats] = useState<Perawat[]>([]);
    const [kriterias, setKriterias] = useState<Kriteria[]>([]);
    const [nilaiList, setNilaiList] = useState<Nilai[]>([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({ perawatId: 0, kriteriaId: 0, nilai: "" });

    // Load semua data
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

    return (
        <div className="p-4 md:p-6 space-y-8">
            {/* Form Input */}
            <div className="p-4 md:p-6 rounded-lg shadow-md max-w-xl mx-auto space-y-4">
                <Label>Perawat</Label>
                <Select
                    value={formData.perawatId === 0 ? "" : formData.perawatId.toString()}
                    onValueChange={(v) => setFormData({ ...formData, perawatId: Number(v) })}
                >
                    <SelectTrigger>
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

                <Label>Kriteria</Label>
                <Select
                    value={formData.kriteriaId === 0 ? "" : formData.kriteriaId.toString()}
                    onValueChange={(v) => setFormData({ ...formData, kriteriaId: Number(v) })}
                >
                    <SelectTrigger>
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

                <Label>Nilai</Label>
                <Input
                    type="number"
                    value={formData.nilai}
                    onChange={(e) => setFormData({ ...formData, nilai: e.target.value })}
                />

                <Button onClick={handleSubmit} disabled={loading} className="w-full">
                    {loading ? <LoadingSpinner /> : "Simpan"}
                </Button>
            </div>


            {/* Tabel Penilaian */}
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
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {nilaiList.map((n) => (
                                <TableRow key={n.id} className="hover">
                                    <TableCell>{n.id}</TableCell>
                                    <TableCell>{n.perawat.nama}</TableCell>
                                    <TableCell>{n.kriteria.nama}</TableCell>
                                    <TableCell>{n.nilai}</TableCell>
                                    <TableCell>
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
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>

    );
}
