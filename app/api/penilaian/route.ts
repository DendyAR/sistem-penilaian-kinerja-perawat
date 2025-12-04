import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
	try {
		const data = await prisma.nilai.findMany({
			include: {
				perawat: true,
				kriteria: true,
			},
			orderBy: { id: "asc" },
		});

		return NextResponse.json(data);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Gagal mengambil data penilaian" },
			{ status: 500 }
		);
	}
}

export interface NilaiCreateBody {
	perawatId: number;
	kriteriaId: number;
	nilai: number;
}

// POST → tambah penilaian baru
export async function POST(req: Request) {
	try {
		const body: NilaiCreateBody = await req.json();

		if (!body.perawatId || !body.kriteriaId || body.nilai == null) {
			return NextResponse.json(
				{ error: "Perawat, kriteria, dan nilai wajib diisi" },
				{ status: 400 }
			);
		}

		const newData = await prisma.nilai.create({
			data: {
				perawatId: body.perawatId,
				kriteriaId: body.kriteriaId,
				nilai: body.nilai,
			},
		});

		return NextResponse.json(newData, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Gagal menambahkan penilaian" },
			{ status: 500 }
		);
	}
}
