import { invariant } from "@epic-web/invariant";
import { type BetterAuthPlugin, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthEndpoint, sessionMiddleware } from "better-auth/api";
import { SignJWT } from "jose";
import { db } from "./db";

export function zeroAuth() {
	return {
		id: "zero-auth",
		endpoints: {
			getToken: createAuthEndpoint(
				"/token",
				{
					method: "GET",
					requireHeaders: true,
					use: [sessionMiddleware],
					metadata: {
						openapi: {
							description: "Get a JWT token",
							responses: {
								200: {
									description: "Success",
									content: {
										"application/json": {
											schema: {
												type: "object",
												properties: {
													token: {
														type: "string",
													},
												},
											},
										},
									},
								},
							},
						},
					},
				},
				async (ctx) => {
					const authSecret = process.env.ZERO_AUTH_SECRET;
					const user = ctx.context.session.user;

					invariant(authSecret, "Missing auth secret");

					const token = await new SignJWT({
						sub: user.id,
						iat: Math.floor(Date.now() / 1000),
					})
						.setProtectedHeader({ alg: "HS256" })
						.setExpirationTime("15m")
						.sign(new TextEncoder().encode(authSecret));

					return ctx.json({ token });
				},
			),
		},
	} satisfies BetterAuthPlugin;
}

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: "pg" }),
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
	},
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // Cache duration in seconds
		},
	},
	plugins: [zeroAuth()],
});
