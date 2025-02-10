import type { BetterAuthClientPlugin } from "better-auth";
import { createAuthClient } from "better-auth/react";
import type { zeroAuth } from "./.server/auth";

function zeroAuthClient() {
	return {
		id: "zero-auth-client",
		$InferServerPlugin: {} as ReturnType<typeof zeroAuth>,
	} satisfies BetterAuthClientPlugin;
}
export const authClient = createAuthClient({
	plugins: [zeroAuthClient()],
});
