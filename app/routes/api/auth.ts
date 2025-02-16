import { auth } from "~/modules/.server/auth";
import type { Route } from "./+types/auth";

export async function loader({ request }: Route.LoaderArgs) {
	return auth.handler(request);
}

export async function action({ request }: Route.ActionArgs) {
	return auth.handler(request);
}
