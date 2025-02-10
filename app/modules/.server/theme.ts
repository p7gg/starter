import { type } from "arktype";
import * as cookie from "cookie";
import { ThemeSchema, type ThemeValueExtended } from "../utils";

const cookieName = "theme";

export function getTheme(request: Request) {
	const cookieHeader = request.headers.get("cookie");
	const parsed = cookieHeader
		? cookie.parse(cookieHeader)[cookieName]
		: "light";

	const out = ThemeSchema.base(parsed);
	return out instanceof type.errors ? null : out;
}

export function setTheme(theme: ThemeValueExtended) {
	if (theme === "system") {
		return cookie.serialize(cookieName, "", { path: "/", maxAge: -1 });
	}

	return cookie.serialize(cookieName, theme, {
		path: "/",
		maxAge: 31536000,
	});
}
