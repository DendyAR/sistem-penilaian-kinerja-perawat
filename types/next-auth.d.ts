import { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface User {
		id: string;
		username: string;
		name?: string | null;
		role: string; // ← tambahkan role
	}

	interface Session {
		user: {
			id: string;
			username: string;
			name?: string | null;
			role: string; // ← tambahkan role
		} & DefaultSession["user"];
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		role: string;
	}
}
