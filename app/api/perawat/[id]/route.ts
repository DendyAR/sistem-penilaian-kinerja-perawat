import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

// Schema update
const perawatUpdateSchema = z.object({
	nama: z.string().min(1).optional(),
	departemen: z.string().nullable().optional(),
});

type Params = { id: string };

// Helper ambil ID
async function getId(paramsPromise: Promise<Params>): Promise<number> {
	const params = await paramsPromise;
	return Number(params.id);
}

// =======================
// GET — Ambil detail perawat
// =======================
export async function GET(req: Request, context: { params: Promise<Params> }) {
	try {
		const id = await getId(context.params);

		const perawat = await prisma.perawat.findUnique({
			where: { id },
		});

		if (!perawat)
			return NextResponse.json(
				{ error: "Perawat tidak ditemukan" },
				{ status: 404 }
			);

		return NextResponse.json(perawat, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ error: "Terjadi kesalahan server" },
			{ status: 500 }
		);
	}
}

// =======================
// PUT — Update perawat
// =======================
export async function PUT(req: Request, context: { params: Promise<Params> }) {
	try {
		const id = await getId(context.params);
		const json = await req.json();
		const body = perawatUpdateSchema.parse(json);

		const updated = await prisma.perawat.update({
			where: { id },
			data: {
				nama: body.nama ?? undefined,
				departemen: body.departemen ?? undefined,
			},
		});

		return NextResponse.json(
			{ message: "Perawat berhasil diperbarui", data: updated },
			{ status: 200 }
		);
	} catch (err) {
		if (err instanceof z.ZodError)
			return NextResponse.json({ error: err.issues }, { status: 400 });

		return NextResponse.json(
			{ error: "Gagal memperbarui perawat" },
			{ status: 500 }
		);
	}
}

// =======================
// DELETE — Hapus perawat
// =======================
export async function DELETE(
	req: Request,
	context: { params: Promise<Params> }
) {
	try {
		const id = await getId(context.params);

		await prisma.perawat.delete({
			where: { id },
		});

		return NextResponse.json(
			{ message: "Perawat berhasil dihapus" },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json(
			{ error: "Gagal menghapus perawat" },
			{ status: 500 }
		);
	}
}
