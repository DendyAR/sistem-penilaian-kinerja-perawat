import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Tipe kriteria
export type JenisKriteria = "benefit" | "cost";

export interface KriteriaCreateBody {
	nama: string;
	bobot: number;
	jenis: JenisKriteria;
}

// ----------------- GET /api/kriteria -----------------
export async function GET() {
	try {
		const data = await prisma.kriteria.findMany({
			orderBy: { id: "asc" },
		});

		return NextResponse.json(data);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Gagal mengambil data kriteria" },
			{ status: 500 }
		);
	}
}

// ----------------- POST /api/kriteria -----------------
export async function POST(req: Request) {
	try {
		const body: KriteriaCreateBody = await req.json();

		// Validasi sederhana
		if (!body.nama || body.bobot == null || !body.jenis) {
			return NextResponse.json(
				{ error: "Nama, bobot, dan jenis kriteria wajib diisi" },
				{ status: 400 }
			);
		}

		const newData = await prisma.kriteria.create({
			data: {
				nama: body.nama,
				bobot: Number(body.bobot), // pastikan Float
				jenis: body.jenis,
			},
		});

		return NextResponse.json(newData, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Gagal menambahkan kriteria" },
			{ status: 500 }
		);
	}
}
