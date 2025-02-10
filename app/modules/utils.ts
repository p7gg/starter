import { getHintUtils } from "@epic-web/client-hints";
import { clientHint as colorSchemeHint } from "@epic-web/client-hints/color-scheme";
import { clientHint as timeZoneHint } from "@epic-web/client-hints/time-zone";
import { type } from "arktype";
import { defineConfig } from "cva";
import { twMerge } from "tailwind-merge";

export const { getHints, getClientHintCheckScript } = getHintUtils({
	theme: colorSchemeHint,
	timeZone: timeZoneHint,
});

export type ThemeValue = typeof ThemeSchema.base.infer;
export type ThemeValueExtended = typeof ThemeSchema.extended.infer;
export const ThemeSchema = type.module({
	base: "'light' | 'dark'",
	extended: "base | 'system'",
});

export type { VariantProps } from "cva";

export const { compose, cva, cx } = defineConfig({
	hooks: {
		onComplete: (classes) => twMerge(classes),
	},
});

/**
 * Simple debounce implementation
 */
export function debounce<
	Callback extends (...args: Parameters<Callback>) => void,
>(fn: Callback, delay: number) {
	let timer: ReturnType<typeof setTimeout> | null = null;
	return (...args: Parameters<Callback>) => {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			fn(...args);
		}, delay);
	};
}

export async function downloadFile(url: string, retries = 0) {
	const MAX_RETRIES = 3;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch image with status ${response.status}`);
		}
		const contentType = response.headers.get("content-type") ?? "image/jpg";
		const blob = Buffer.from(await response.arrayBuffer());
		return { contentType, blob };
	} catch (e) {
		if (retries > MAX_RETRIES) throw e;
		return downloadFile(url, retries + 1);
	}
}
