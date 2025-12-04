import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcrypt";
import type { NextAuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),

	session: {
		strategy: "jwt",
	},

	pages: {
		signIn: "/auth/login",
	},

	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				username: { label: "Username", type: "username" },
				password: { label: "Password", type: "password" },
			},

			async authorize(credentials) {
				if (!credentials?.username || !credentials.password) return null;

				const user = await prisma.admin.findUnique({
					where: { username: credentials.username },
				});

				if (!user) return null;

				const isValid = await bcrypt.compare(
					credentials.password,
					user.password
				);
				if (!isValid) return null;

				return user;
			},
		}),
	],

	callbacks: {
		async jwt({ token, user }): Promise<JWT> {
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		},

		async session({ session, token }): Promise<Session> {
			return {
				...session,
				user: {
					...session.user,
					id: token.id as string,
					role: token.role as string,
				},
			};
		},
	},
};
