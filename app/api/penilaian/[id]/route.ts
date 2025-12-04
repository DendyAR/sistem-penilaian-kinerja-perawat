import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
	params: { id: string } | Promise<{ id: string }>;
}

// GET satu nilai
export async function GET(req: Request, { params }: RouteParams) {
	try {
		const { id } = "then" in params ? await params : params;

		const data = await prisma.nilai.findUnique({
			where: { id: Number(id) },
			include: { perawat: true, kriteria: true },
		});

		if (!data) {
			return NextResponse.json(
				{ error: "Nilai tidak ditemukan" },
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

// PUT → update nilai
export async function PUT(req: Request, { params }: RouteParams) {
	try {
		const { id } = "then" in params ? await params : params;
		const body = await req.json();
		const { nilai } = body;

		const updated = await prisma.nilai.update({
			where: { id: Number(id) },
			data: { nilai: Number(nilai) },
		});

		return NextResponse.json(updated);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Gagal mengupdate nilai" },
			{ status: 500 }
		);
	}
}

// DELETE → hapus nilai
export async function DELETE(req: Request, { params }: RouteParams) {
	try {
		const { id } = "then" in params ? await params : params;

		await prisma.nilai.delete({
			where: { id: Number(id) },
		});

		return NextResponse.json({ message: "Penilaian dihapus" });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Gagal menghapus nilai" },
			{ status: 500 }
		);
	}
}
