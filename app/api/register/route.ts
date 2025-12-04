import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
	try {
		const { username, password, role } = await req.json();

		// VALIDASI INPUT
		if (!username || !password) {
			return NextResponse.json(
				{ error: "Username dan password wajib diisi" },
				{ status: 400 }
			);
		}

		// CEK USERNAME SUDAH ADA
		const exists = await prisma.admin.findUnique({
			where: { username },
		});

		if (exists) {
			return NextResponse.json(
				{ error: "Username sudah terpakai" },
				{ status: 400 }
			);
		}

		// HASH PASSWORD
		const hashedPassword = await bcrypt.hash(password, 10);

		// BUAT ADMIN BARU
		const admin = await prisma.admin.create({
			data: {
				username,
				password: hashedPassword,
				role: role || "admin", // default admin jika tidak dikirim
			},
			select: {
				id: true,
				username: true,
				role: true,
				createdAt: true,
			},
		});

		return NextResponse.json({ admin }, { status: 201 });
	} catch (err) {
		console.error("REGISTER ERROR:", err);
		return NextResponse.json(
			{ error: "Terjadi kesalahan server" },
			{ status: 500 }
		);
	}
}
