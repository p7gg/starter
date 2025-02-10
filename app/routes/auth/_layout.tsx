import { Outlet, redirect } from "react-router";
import { auth } from "~/modules/.server/auth";
import type { Route } from "./+types/_layout";

export async function loader({ request }: Route.LoaderArgs) {
	const data = await auth.api.getSession({ headers: request.headers });
	if (data) {
		throw redirect("/app");
	}
	return null;
}

export default function Layout() {
	return <Outlet />;
}
