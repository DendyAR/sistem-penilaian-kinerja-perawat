import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

// Schema validasi Perawat
const perawatSchema = z.object({
	nama: z.string().min(1, "Nama wajib diisi"),
	departemen: z.string().optional(),
});

// =======================
// GET — Ambil semua perawat
// =======================
export async function GET() {
	try {
		const perawat = await prisma.perawat.findMany({
			orderBy: { id: "asc" },
		});

		return NextResponse.json(perawat, { status: 200 });
	} catch (err) {
		console.error("GET perawat error:", err);
		return NextResponse.json(
			{ error: "Tidak dapat mengambil data perawat" },
			{ status: 500 }
		);
	}
}

// =======================
// POST — Tambah perawat
// =======================
export async function POST(req: Request) {
	try {
		const json = await req.json();
		const body = perawatSchema.parse(json);

		const perawatBaru = await prisma.perawat.create({
			data: {
				nama: body.nama,
				departemen: body.departemen ?? null,
			},
		});

		return NextResponse.json(
			{ message: "Perawat berhasil ditambahkan", data: perawatBaru },
			{ status: 201 }
		);
	} catch (err) {
		if (err instanceof z.ZodError)
			return NextResponse.json({ error: err.issues }, { status: 400 });

		return NextResponse.json(
			{ error: "Terjadi kesalahan server" },
			{ status: 500 }
		);
	}
}
