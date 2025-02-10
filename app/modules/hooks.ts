import { invariant } from "@epic-web/invariant";
import { type } from "arktype";
import React from "react";
import {
	useFetchers,
	useFormAction,
	useNavigation,
	useRouteLoaderData,
} from "react-router";
import type { Info as RootInfo } from "../+types/root";
import type { Info as ThemeSwitchInfo } from "../routes/api/+types/theme-switch";
import { ThemeSchema, debounce } from "./utils";

/**
 * Custom hook that retrieves optional request information from the route loader data.
 *
 * @returns The request information if available, otherwise undefined.
 */
export function useOptionalRequestInfo() {
	const data = useRouteLoaderData<RootInfo["loaderData"]>(
		"root" satisfies RootInfo["id"],
	);
	return data?.requestInfo;
}

/**
 * Custom hook that retrieves the request information and throws an error if not available.
 *
 * @throws {Error} Throws an error if the request information is missing.
 *
 */
export function useRequestInfo() {
	const requestInfo = useOptionalRequestInfo();
	invariant(requestInfo, "Missing request info");
	return requestInfo;
}

/**
 * Custom hook that retrieves the hints from the request information.
 *
 * @returns The hints available in the request information.
 */
export function useHints() {
	const requestInfo = useRequestInfo();
	return requestInfo.hints;
}

/**
 * Custom hook that retrieves optional hints from the request information.
 *
 * @returns The hints if available, otherwise undefined.
 */
export function useOptionalHints() {
	const requestInfo = useOptionalRequestInfo();
	return requestInfo?.hints;
}

/**
 * Custom hook to monitor a media query and return its matching state.
 *
 * @param query - The media query to match against (e.g., "(min-width: 600px)").
 * @returns `true` if the media query matches the current state, `false` otherwise.
 */
export function useMediaQuery(query: string) {
	const [value, setValue] = React.useState(false);

	React.useEffect(() => {
		const onChange = (event: MediaQueryListEvent) => {
			setValue(event.matches);
		};

		const result = matchMedia(query);
		result.addEventListener("change", onChange);
		setValue(result.matches);

		return () => result.removeEventListener("change", onChange);
	}, [query]);

	return value;
}

/**
 * Custom hook to retrieve the optimistic theme, if available, based on fetchers.
 *
 * @returns The optimistic theme if found, otherwise null.
 */
export function useOptimisticTheme() {
	const fetchers = useFetchers();
	const themeFetcher = fetchers.find(
		(f) =>
			f.formAction === ("api/theme-switch" satisfies ThemeSwitchInfo["path"]),
	);

	const out = ThemeSchema.extended(themeFetcher?.formData?.get("theme"));

	return out instanceof type.errors ? null : out;
}

/**
 * Custom hook that returns the current theme, prioritizing optimistic theme settings,
 * and falling back to the request info and hints if needed.
 *
 * @returns The current theme (either optimistic, request info, or hints).
 */
export function useTheme() {
	const hints = useHints();
	const requestInfo = useRequestInfo();
	const optimisticMode = useOptimisticTheme();
	if (optimisticMode) {
		return optimisticMode === "system" ? hints.theme : optimisticMode;
	}
	return requestInfo.userPrefs.theme ?? hints.theme;
}

/**
 * Custom hook that retrieves the current theme with optional fallbacks from hints and request info.
 *
 * @returns The current theme if available, otherwise undefined.
 */
export function useOptionalTheme() {
	const optionalHints = useOptionalHints();
	const optionalRequestInfo = useOptionalRequestInfo();
	const optimisticMode = useOptimisticTheme();
	if (optimisticMode) {
		return optimisticMode === "system" ? optionalHints?.theme : optimisticMode;
	}
	return optionalRequestInfo?.userPrefs.theme ?? optionalHints?.theme;
}

/**
 * Debounce a callback function
 */
export function useDebounce<
	Callback extends (...args: Parameters<Callback>) => ReturnType<Callback>,
>(callback: Callback, delay: number) {
	const callbackRef = React.useRef(callback);
	React.useEffect(() => {
		callbackRef.current = callback;
	});
	return React.useMemo(
		() =>
			debounce(
				(...args: Parameters<Callback>) => callbackRef.current(...args),
				delay,
			),
		[delay],
	);
}

/**
 * Returns true if the current navigation is submitting the current route's
 * form. Defaults to the current route's form action and method POST.
 *
 * Defaults state to 'non-idle'
 *
 * NOTE: the default formAction will include query params, but the
 * navigation.formAction will not, so don't use the default formAction if you
 * want to know if a form is submitting without specific query params.
 */
export function useIsPending({
	formAction,
	formMethod = "POST",
	state = "non-idle",
}: {
	formAction?: string;
	formMethod?: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
	state?: "submitting" | "loading" | "non-idle";
} = {}) {
	const contextualFormAction = useFormAction();
	const navigation = useNavigation();
	const isPendingState =
		state === "non-idle"
			? navigation.state !== "idle"
			: navigation.state === state;
	return (
		isPendingState &&
		navigation.formAction === (formAction ?? contextualFormAction) &&
		navigation.formMethod === formMethod
	);
}
