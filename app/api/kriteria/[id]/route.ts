import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Tipe params sesuai Next.js App Router
interface RouteParams {
	params: { id: string } | Promise<{ id: string }>;
}

// ----------------- GET -----------------
export async function GET(req: Request, { params }: RouteParams) {
	try {
		const { id } = "then" in params ? await params : params;
		const data = await prisma.kriteria.findUnique({
			where: { id: Number(id) },
		});

		if (!data) {
			return NextResponse.json(
				{ error: "Kriteria tidak ditemukan" },
				{ status: 404 }
			);
		}

		return NextResponse.json(data);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Gagal mengambil data" },
			{ status: 500 }
		);
	}
}

// ----------------- PUT -----------------
export async function PUT(req: Request, { params }: RouteParams) {
	try {
		const { id } = "then" in params ? await params : params;
		const body = await req.json();
		const { nama, bobot, jenis } = body;

		const updated = await prisma.kriteria.update({
			where: { id: Number(id) },
			data: {
				nama,
				bobot: Number(bobot),
				jenis,
			},
		});

		return NextResponse.json(updated);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Gagal mengupdate kriteria" },
			{ status: 500 }
		);
	}
}

// ----------------- DELETE -----------------
export async function DELETE(req: Request, { params }: RouteParams) {
	try {
		const { id } = "then" in params ? await params : params;

		await prisma.kriteria.delete({
			where: { id: Number(id) },
		});

		return NextResponse.json({ message: "Kriteria dihapus" }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Gagal menghapus kriteria" },
			{ status: 500 }
		);
	}
}
