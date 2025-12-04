"use client"

import Link from "next/link";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";

interface Statistik {
    totalPerawat: number;
    totalKriteria: number;
    totalPenilaianBaru: number;
}

export default function Home() {
    const [stats, setStats] = useState<Statistik | null>(null);
    const [loading, setLoading] = useState(true);

    const loadStats = async () => {
        setLoading(true);
        try {
            const [resPerawat, resKriteria, resNilai] = await Promise.all([
                fetch("/api/perawat"),
                fetch("/api/kriteria"),
                fetch("/api/penilaian"),
            ]);

            const perawats = await resPerawat.json();
            const kriterias = await resKriteria.json();
            const nilaiList = await resNilai.json();

            // misal penilaian baru = nilai yang belum di-verifikasi (atribut tambahan bisa ditambahkan di backend)
            const penilaianBaru = nilaiList.length; // sesuaikan sesuai kondisi

            setStats({
                totalPerawat: perawats.length,
                totalKriteria: kriterias.length,
                totalPenilaianBaru: penilaianBaru,
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    if (loading || !stats) {
        return (
            <div className="flex h-screen justify-center py-10">
                <LoadingSpinner />
            </div>
        );
    }
    return (
        <div className="p-6 space-y-8">
            {/* HEADER */}
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold tracking-tight">
                    Dashboard Sistem Penilaian Perawat
                </h1>
                <p className="text-muted-foreground">
                    Kelola data perawat, penilaian dan hasil perhitungan SAW.
                </p>
            </div>

            <Separator />

            {/* GRID STATISTIK */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Perawat</CardTitle>
                        <CardDescription>Jumlah seluruh perawat aktif</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.totalPerawat}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Kriteria Penilaian</CardTitle>
                        <CardDescription>Kriteria yang digunakan SAW</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.totalKriteria}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Penilaian Baru</CardTitle>
                        <CardDescription>Penilaian menunggu verifikasi</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.totalPenilaianBaru}</p>
                    </CardContent>
                </Card>
            </div>

            {/* MENU UTAMA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* CARD DATA PERAWAT */}
                <Card className="hover:shadow-lg transition">
                    <CardHeader>
                        <CardTitle>Data Perawat</CardTitle>
                        <CardDescription>
                            Kelola daftar perawat dan identitas mereka
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/data-perawat">
                            <Button className="w-full" variant="default">
                                Lihat Data Perawat
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* CARD KRITERIA PENILAIAN (BARU DITAMBAHKAN) */}
                <Card className="hover:shadow-lg transition">
                    <CardHeader>
                        <CardTitle>Kriteria Penilaian</CardTitle>
                        <CardDescription>
                            Atur daftar kriteria beserta bobot SAW
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/kriteria">
                            <Button className="w-full" variant="default">
                                Kelola Kriteria
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* CARD PENILAIAN */}
                <Card className="hover:shadow-lg transition">
                    <CardHeader>
                        <CardTitle>Penilaian</CardTitle>
                        <CardDescription>
                            Tambah nilai dan lakukan penilaian kinerja
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/penilaian">
                            <Button className="w-full" variant="default">
                                Kelola Penilaian
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* CARD PERHITUNGAN SAW */}
                <Card className="hover:shadow-lg transition">
                    <CardHeader>
                        <CardTitle>Perhitungan SAW</CardTitle>
                        <CardDescription>
                            Hasil perhitungan normalisasi & ranking akhir
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/perhitungan">
                            <Button className="w-full" variant="default">
                                Lihat Hasil Perhitungan
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* CARD PROFIL */}
                <Card className="hover:shadow-lg transition">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Profil Anda</CardTitle>
                            <CardDescription>Informasi akun login</CardDescription>
                        </div>
                        <Avatar>
                            <AvatarFallback>DR</AvatarFallback>
                        </Avatar>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Login sebagai <span className="font-medium">Admin</span>
                        </p>

                        <Link href="/profile">
                            <Button variant="outline" className="w-full">
                                Kelola Akun
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
