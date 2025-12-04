"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/spinner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Model Perawat
interface Perawat {
    id: number;
    nama: string;
}

// Model Kriteria
interface Kriteria {
    id: number;
    nama: string;
    bobot: number;
    jenis: "benefit" | "cost";
}

// Model Nilai
interface Nilai {
    id: number;
    perawatId: number;
    kriteriaId: number;
    nilai: number;
    perawat: Perawat;
    kriteria: Kriteria;
}

// Model Skor hasil perhitungan
interface Skor {
    perawatId: number;
    nama: string;
    totalSkor: number;
    rank: number;
}

export default function PerhitunganPage() {
    const [perawats, setPerawats] = useState<Perawat[]>([]);
    const [kriterias, setKriterias] = useState<Kriteria[]>([]);
    const [nilaiList, setNilaiList] = useState<Nilai[]>([]);
    const [loading, setLoading] = useState(false);
    const [normalized, setNormalized] = useState<Record<number, Record<number, number>>>(
        {}
    );
    const [ranking, setRanking] = useState<Skor[]>([]);
    const [filteredPerawats, setFilteredPerawats] = useState<Perawat[]>([]);
    const [filteredRanking, setFilteredRanking] = useState<Skor[]>([]);
    const [search, setSearch] = useState("");
    const [calculated, setCalculated] = useState(false);

    // Load data awal (tanpa perhitungan)
    const loadData = async () => {
        setLoading(true);
        try {
            const [resPerawat, resKriteria, resNilai] = await Promise.all([
                fetch("/api/perawat"),
                fetch("/api/kriteria"),
                fetch("/api/penilaian"),
            ]);

            const perawats: Perawat[] = await resPerawat.json();
            const kriterias: Kriteria[] = await resKriteria.json();
            const nilaiList: Nilai[] = await resNilai.json();

            setPerawats(perawats);
            setFilteredPerawats(perawats);
            setKriterias(kriterias);
            setNilaiList(nilaiList);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Hitung normalisasi dan ranking
    const handleHitung = () => {
        const norm: Record<number, Record<number, number>> = {};

        for (const k of kriterias) {
            const values = nilaiList.filter((n) => n.kriteriaId === k.id).map((n) => n.nilai);
            const max = Math.max(...values);
            const min = Math.min(...values);

            for (const n of nilaiList.filter((n) => n.kriteriaId === k.id)) {
                if (!norm[n.perawatId]) norm[n.perawatId] = {};
                norm[n.perawatId][k.id] = k.jenis === "benefit" ? n.nilai / max : min / n.nilai;
            }
        }
        setNormalized(norm);

        const scores: Skor[] = perawats.map((p) => ({
            perawatId: p.id,
            nama: p.nama,
            totalSkor: kriterias.reduce((sum, k) => sum + (norm[p.id]?.[k.id] || 0) * k.bobot, 0),
            rank: 0,
        }));

        const ranked = scores
            .sort((a, b) => b.totalSkor - a.totalSkor)
            .map((s, idx) => ({ ...s, rank: idx + 1 }));

        setRanking(ranked);
        setFilteredRanking(ranked);
        setCalculated(true);
    };

    // Simpan hasil perhitungan ke backend
    const handleSimpan = async () => {
        try {
            await fetch("/api/hasil-perhitungan", {
                method: "POST",
                body: JSON.stringify(
                    ranking.map((r) => ({
                        perawatId: r.perawatId,
                        totalSkor: r.totalSkor,
                        ranking: r.rank,
                    }))
                ),
            });
            alert("Hasil perhitungan berhasil disimpan!");
        } catch (err) {
            console.error(err);
            alert("Gagal menyimpan hasil perhitungan.");
        }
    };

    // Cetak PDF
    const handleCetak = () => {
        const doc = new jsPDF();
        doc.text("Ranking Perawat", 14, 20);
        autoTable(doc, {
            startY: 25,
            head: [["Rank", "Nama Perawat", "Skor"]],
            body: filteredRanking.map((r) => [r.rank, r.nama, r.totalSkor.toFixed(2)]),
        });
        doc.save("ranking_perawat.pdf");
    };

    // Filter search
    const handleSearch = (value: string) => {
        setSearch(value);
        if (calculated) {
            setFilteredRanking(ranking.filter((r) => r.nama.toLowerCase().includes(value.toLowerCase())));
        } else {
            setFilteredPerawats(perawats.filter((p) => p.nama.toLowerCase().includes(value.toLowerCase())));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Kontrol Search & Tombol */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <Input
                    placeholder="Cari perawat..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="max-w-sm"
                />
                <div className="flex gap-2 flex-wrap">
                    <Button onClick={handleHitung}>Hitung Nilai Sekarang</Button>
                    {calculated && (
                        <>
                            <Button onClick={handleSimpan} variant="secondary">
                                Simpan
                            </Button>
                            <Button onClick={handleCetak} variant="outline">
                                Cetak PDF
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Tabel Nilai Mentah */}
            <Card className="overflow-auto">
                <CardHeader>
                    <CardTitle>Tabel Nilai Mentah</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table className="min-w-[600px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Alternatif</TableHead>
                                {kriterias.map((k) => (
                                    <TableHead key={k.id}>{k.nama}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPerawats.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>{p.nama}</TableCell>
                                    {kriterias.map((k) => {
                                        const n = nilaiList.find((n) => n.perawatId === p.id && n.kriteriaId === k.id);
                                        return <TableCell key={k.id}>{n?.nilai ?? "-"}</TableCell>;
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Tabel Normalisasi */}
            {calculated && (
                <Card className="overflow-auto">
                    <CardHeader>
                        <CardTitle>Tabel Normalisasi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table className="min-w-[600px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Alternatif</TableHead>
                                    {kriterias.map((k) => (
                                        <TableHead key={k.id}>{k.nama}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRanking.map((r) => (
                                    <TableRow key={r.perawatId}>
                                        <TableCell>{r.nama}</TableCell>
                                        {kriterias.map((k) => (
                                            <TableCell key={k.id}>{normalized[r.perawatId]?.[k.id]?.toFixed(4) ?? "-"}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* Tabel Ranking */}
            {calculated && (
                <Card className="overflow-auto">
                    <CardHeader>
                        <CardTitle>Ranking Perawat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table className="min-w-[400px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Alternatif</TableHead>
                                    <TableHead>Skor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRanking.map((r) => (
                                    <TableRow key={r.perawatId}>
                                        <TableCell>{r.rank}</TableCell>
                                        <TableCell>{r.nama}</TableCell>
                                        <TableCell>{r.totalSkor.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
