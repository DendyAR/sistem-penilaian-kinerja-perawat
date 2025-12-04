// app/api/hasil-perhitungan/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Definisi tipe payload
interface HasilPerhitunganPayload {
	perawatId: number;
	totalSkor: number;
	ranking: number;
}

export async function POST(req: Request) {
	try {
		const body = await req.json();

		if (!Array.isArray(body)) {
			return NextResponse.json(
				{ error: "Payload harus berupa array" },
				{ status: 400 }
			);
		}

		// Validasi setiap item agar sesuai tipe HasilPerhitunganPayload
		const dataToCreate: HasilPerhitunganPayload[] = body.map((item) => {
			const { perawatId, totalSkor, ranking } = item;

			if (
				typeof perawatId !== "number" ||
				typeof totalSkor !== "number" ||
				typeof ranking !== "number"
			) {
				throw new Error("Payload tidak valid");
			}

			return { perawatId, totalSkor, ranking };
		});

		// Simpan ke database (bulk insert)
		const created = await prisma.hasilPerhitungan.createMany({
			data: dataToCreate,
			skipDuplicates: true, // menghindari duplikat perawat jika sudah ada
		});

		return NextResponse.json({
			message: "Hasil perhitungan berhasil disimpan",
			created,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Gagal menyimpan hasil perhitungan" },
			{ status: 500 }
		);
	}
}
