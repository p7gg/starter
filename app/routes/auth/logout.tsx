import { redirect } from "react-router";
import { authClient } from "~/modules/auth";
import type { Route } from "./+types/logout";

export async function clientAction(_args: Route.ClientActionArgs) {
	const { data, error } = await authClient.signOut();

	if (data) {
		throw redirect("/");
	}

	return { data: null, error: error.message };
}
