import "./app.css";

import { subscribeToSchemeChange } from "@epic-web/client-hints/color-scheme";
import React from "react";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	useRevalidator,
} from "react-router";
import type { Route } from "./+types/root";
import { LogoutForm } from "./components/logout-form";
import { ThemeSwitcher } from "./components/theme-switcher";
import { getTheme } from "./modules/.server/theme";
import { useOptionalTheme } from "./modules/hooks";
import { getClientHintCheckScript, getHints } from "./modules/utils";

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
];

export async function loader({ request }: Route.LoaderArgs) {
	return {
		requestInfo: {
			hints: getHints(request),
			path: new URL(request.url).pathname,
			userPrefs: {
				theme: getTheme(request),
			},
		},
	};
}

export function Layout({ children }: { children: React.ReactNode }) {
	const theme = useOptionalTheme();

	return (
		<html lang="en" data-theme={theme}>
			<head>
				{import.meta.env.DEV ? (
					<script src="https://unpkg.com/react-scan/dist/auto.global.js" />
				) : null}
				<ClientHintCheck nonce="" />
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="bg-bg text-fg">
				<header className="flex items-center justify-between">
					<ThemeSwitcher />
					<LogoutForm />
				</header>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="container mx-auto p-4 pt-16">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full overflow-x-auto p-4">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}

function ClientHintCheck({ nonce }: { nonce: string }) {
	const { revalidate } = useRevalidator();
	React.useEffect(
		() => subscribeToSchemeChange(() => revalidate()),
		[revalidate],
	);

	return (
		<script
			nonce={nonce}
			// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
			dangerouslySetInnerHTML={{ __html: getClientHintCheckScript() }}
		/>
	);
}
