import {
	type ExpressionBuilder,
	NOBODY_CAN,
	createSchema,
	definePermissions,
	number,
	string,
	table,
} from "@rocicorp/zero";
import { useZero as useZeroBase } from "@rocicorp/zero/react";
import type { createZeroSchema } from "drizzle-zero";
import type * as drizzleSchema from "./.server/drizzle";

export const schema = createSchema(1, {
	tables: [
		table("user")
			.columns({
				id: string(),
				createdAt: number().from("created_at"),
				email: string(),
				image: string().optional(),
				name: string(),
			})
			.primaryKey("id"),
	],
}) satisfies ReturnType<
	typeof createZeroSchema<
		typeof drizzleSchema,
		{
			user: {
				id: true;
				createdAt: true;
				updatedAt: false;
				email: true;
				emailVerified: false;
				image: true;
				name: true;
			};
			account: false;
			session: false;
			verification: false;
		},
		// biome-ignore lint/complexity/noBannedTypes: <explanation>
		{}
	>
>;

export type Schema = typeof schema;
type AuthData = { sub: string; iat: number };

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
	const allowIfLoggedIn = (
		authData: AuthData,
		{ cmpLit }: ExpressionBuilder<Schema, keyof Schema["tables"]>,
	) => {
		return cmpLit(authData.sub, "IS NOT", null);
	};

	return {
		user: {
			row: {
				select: [allowIfLoggedIn],
				delete: NOBODY_CAN,
				insert: NOBODY_CAN,
				update: {
					preMutation: NOBODY_CAN,
					postMutation: NOBODY_CAN,
				},
			},
		},
	};
});

export const useZero = () => useZeroBase<Schema>();
