import {
	type RouteConfig,
	index,
	layout,
	prefix,
	route,
} from "@react-router/dev/routes";

export default [
	// Public routes
	index("routes/home.tsx"),

	// Authentication routes
	layout(
		"routes/auth/_layout.tsx",
		prefix("auth", [
			route("login", "routes/auth/login.tsx"),
			route("sign-up", "routes/auth/sign-up.tsx"),
			route("logout", "routes/auth/logout.tsx"),
		]),
	),

	// Protected routes
	layout(
		"routes/app/_layout.tsx",
		prefix("app", [index("routes/app/dashboard.tsx")]),
	),

	// API routes
	...prefix("api", [
		route("theme-switch", "routes/api/theme-switch.ts"),
		route("auth/*", "routes/api/auth.ts"),
	]),
] satisfies RouteConfig;
