import { useFetcher } from "react-router";
import { ServerOnly } from "remix-utils/server-only";
import { useOptimisticTheme, useOptionalRequestInfo } from "~/modules/hooks";
import type { Info } from "../routes/api/+types/theme-switch";
import { Icon, type IconName } from "./icons";
import { Button } from "./ui/button";

const THEMES = ["light", "dark", "system"] as const;
const ICONS = {
	dark: "moon",
	light: "sun",
	system: "laptop",
} satisfies Record<(typeof THEMES)[number], IconName>;

export function ThemeSwitcher() {
	const fetcher = useFetcher();

	const requestInfo = useOptionalRequestInfo();
	const optimisticTheme = useOptimisticTheme();

	const userPrefs = requestInfo?.userPrefs.theme;
	const theme = optimisticTheme ?? userPrefs ?? "system";
	const nextTheme = THEMES[(THEMES.indexOf(theme) + 1) % 3];
	const icon = ICONS[theme];

	return (
		<fetcher.Form
			method="POST"
			action={"api/theme-switch" satisfies Info["path"]}
		>
			<ServerOnly>
				{() => (
					<input type="hidden" name="redirectTo" value={requestInfo?.path} />
				)}
			</ServerOnly>
			<input type="hidden" name="theme" value={nextTheme} />
			<Button type="submit" variant="outline" size="icon">
				<Icon name={icon} />
			</Button>
		</fetcher.Form>
	);
}
