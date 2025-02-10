import { Zero } from "@rocicorp/zero";
import { ZeroProvider } from "@rocicorp/zero/react";
import { type } from "arktype";
import React from "react";
import { Outlet, redirect } from "react-router";
import { auth } from "~/modules/.server/auth";
import { authClient } from "~/modules/auth";
import { type Schema, schema } from "~/modules/zero";
import type { Route } from "./+types/_layout";

const TokenSchema = type({ token: "string" });

export async function loader({ request }: Route.LoaderArgs) {
	const data = await auth.api.getSession({ headers: request.headers });
	if (!data) {
		throw redirect("/auth/login");
	}

	return { userID: data.user.id };
}

export default function Layout({ loaderData }: Route.ComponentProps) {
	const { data } = authClient.useSession();
	const [zero, setZero] = React.useState<Zero<Schema> | null>(null);

	const userID = data?.user.id ?? loaderData.userID;

	React.useLayoutEffect(() => {
		const z = new Zero({
			userID,
			schema,

			server: import.meta.env.VITE_PUBLIC_SERVER,
			kvStore: import.meta.env.DEV ? "mem" : "idb",

			auth: async () => {
				const res = await fetch("/api/auth/token");

				if (res.ok) {
					const out = TokenSchema(await res.json());
					return out instanceof type.errors ? undefined : out.token;
				}
			},
		});

		setZero(z);

		return () => {
			z.close();
			setZero(null);
		};
	}, [userID]);

	if (!zero) {
		return null;
	}

	return (
		<ZeroProvider zero={zero}>
			<Outlet />
		</ZeroProvider>
	);
}
