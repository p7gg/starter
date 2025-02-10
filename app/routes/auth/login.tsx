import { type } from "arktype";
import { Form, Link, redirect, useSubmit } from "react-router";
import { Icon } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { authClient } from "~/modules/auth";
import { createArkForm } from "~/modules/form";
import { useIsPending } from "~/modules/hooks";
import { Http } from "~/modules/http";
import type { Route } from "./+types/login";

const Login = createArkForm(
	type({ email: "string.email", password: "string >= 8" }),
);

export async function clientAction({ request }: Route.ClientActionArgs) {
	const [payload, fail] = Login.parseFormData(await request.formData());

	if (fail) {
		throw Http.badRequest(fail.summary);
	}

	const { data, error } = await authClient.signIn.email(payload);

	if (data && !error) {
		throw redirect("/app");
	}

	return Http.ok({
		data: null,
		error: error.message ?? "Error logging user in",
	});
}

export default function Page() {
	const submit = useSubmit();
	const form = Login.useForm({
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const isPending = useIsPending();

	return (
		<Login.FormProvider {...form}>
			<Form
				method="POST"
				onSubmit={form.handleSubmit((_, e) => {
					submit(e?.target);
				})}
			>
				<Login.Field name="email">
					<Login.Label>Email</Login.Label>
					<Login.Input type="email" placeholder="your@email.com" />
					<Login.Message />
				</Login.Field>

				<Login.Field name="password">
					<Login.Label>Password</Login.Label>
					<Login.Input type="password" placeholder="*******" />
					<Login.Message />
				</Login.Field>

				<p>
					Don't have an account?{" "}
					<Link to="/auth/sign-up" className="underline">
						sign up
					</Link>
				</p>

				<Button type="submit" disabled={isPending}>
					{isPending ? (
						<Icon name="loader-circle" className="animate-spin" />
					) : null}
					Sign in
				</Button>
			</Form>
		</Login.FormProvider>
	);
}
