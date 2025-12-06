import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function proxy(req: NextRequest) {
	const { pathname } = req.nextUrl;

	// session token
	const token = await getToken({ req, secret });

	// routes yang tidak butuh login
	const isAuthPage =
		pathname.startsWith("/login") || pathname.startsWith("/register");

	// routes yang WAJIB login: semua dalam segment (main)
	const isProtectedPage = pathname.startsWith("/main") || pathname === "/";

	// ---------------------------------------------------
	// 1. Jika SUDAH login → jangan masuk login/register
	// ---------------------------------------------------
	if (token && isAuthPage) {
		return NextResponse.redirect(new URL("/", req.url));
	}

	// ---------------------------------------------------
	// 2. Jika BELUM login → blokir halaman protected
	// ---------------------------------------------------
	if (!token && isProtectedPage) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/main/:path*", // protect seluruh segment main
		"/", // homepage protected
		"/login",
		"/register",
	],
};
