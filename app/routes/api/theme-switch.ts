import { invariantResponse } from "@epic-web/invariant";
import { type } from "arktype";
import { data, redirect } from "react-router";
import { setTheme } from "~/modules/.server/theme";
import { ThemeSchema } from "~/modules/utils";
import type { Route } from "./+types/theme-switch";

const ActionSchema = type("FormData.parse").pipe(
	type({
		theme: ThemeSchema.extended,
		redirectTo: "string|null?",
	}),
);

export async function action({ request }: Route.ActionArgs) {
	const out = ActionSchema(await request.formData());

	invariantResponse(!(out instanceof type.errors), "Invalid theme received");

	const { theme, redirectTo } = out;

	const responseInit = {
		headers: { "set-cookie": setTheme(theme) },
	} satisfies ResponseInit;
	if (redirectTo) {
		return redirect(redirectTo, responseInit);
	}
	return data(theme, responseInit);
}
