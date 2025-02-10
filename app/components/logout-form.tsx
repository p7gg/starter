import { Form } from "react-router";
import { authClient } from "~/modules/auth";
import { useIsPending } from "~/modules/hooks";
import type { Info as LogoutInfo } from "../routes/auth/+types/logout";
import { Icon } from "./icons";
import { Button } from "./ui/button";

export function LogoutForm() {
	const { data } = authClient.useSession();

	const formAction = "/auth/logout" satisfies `/${LogoutInfo["path"]}`;
	const isPending = useIsPending({ formAction });

	if (!data) {
		return null;
	}

	return (
		<Form method="post" action={formAction}>
			<Button type="submit" disabled={isPending}>
				{isPending ? (
					<Icon name="loader-circle" className="animate-spin" />
				) : null}
				Logout
			</Button>
		</Form>
	);
}
