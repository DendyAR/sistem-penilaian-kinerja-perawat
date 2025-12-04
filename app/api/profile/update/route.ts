import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const adminId = session.user.id;

		const { username, password } = await req.json();

		const updateData: {
			username?: string;
			password?: string;
		} = {};

		if (username) updateData.username = username;
		if (password) updateData.password = await bcrypt.hash(password, 10);

		await prisma.admin.update({
			where: { id: adminId },
			data: updateData,
		});

		return NextResponse.json({ message: "Profile updated" });
	} catch (err) {
		console.error("PROFILE UPDATE ERROR:", err);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
