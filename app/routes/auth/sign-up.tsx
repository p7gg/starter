import { type } from "arktype";
import { Form, Link, redirect, useSubmit } from "react-router";
import { Icon } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { authClient } from "~/modules/auth";
import { createArkForm } from "~/modules/form";
import { useIsPending } from "~/modules/hooks";
import { Http } from "~/modules/http";
import type { Route } from "./+types/sign-up";

const SignUp = createArkForm(
	type({
		name: "string>=1",
		email: "string.email",
		password: "string>=8",
		confirmPassword: "string>=8",
	}).narrow((values, ctx) => {
		if (values.password !== values.confirmPassword) {
			return ctx.reject({
				expected: "identical to password",
				actual: "",
				path: ["confirmPassword"],
			});
		}

		return true;
	}),
);

export async function clientAction({ request }: Route.ClientActionArgs) {
	const [payload, fail] = SignUp.parseFormData(await request.formData());

	if (fail) {
		throw Http.badRequest(fail.summary);
	}

	const { data, error } = await authClient.signUp.email(payload);

	if (data && !error) {
		return redirect("/auth/login");
	}

	return Http.ok({
		data: null,
		error: error.message ?? "Error signing user up",
	});
}

export default function Page(_: Route.ComponentProps) {
	const submit = useSubmit();
	const form = SignUp.useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const isPending = useIsPending();

	return (
		<SignUp.FormProvider {...form}>
			<Form
				method="POST"
				onSubmit={form.handleSubmit((_, e) => {
					submit(e?.target);
				})}
			>
				<SignUp.Field name="name">
					<SignUp.Label>Name</SignUp.Label>
					<SignUp.Input type="text" placeholder="your name" />
					<SignUp.Message />
				</SignUp.Field>

				<SignUp.Field name="email">
					<SignUp.Label>Email</SignUp.Label>
					<SignUp.Input type="email" placeholder="your@email.com" />
					<SignUp.Message />
				</SignUp.Field>

				<SignUp.Field name="password">
					<SignUp.Label>Password</SignUp.Label>
					<SignUp.Input type="password" placeholder="*******" />
					<SignUp.Message />
				</SignUp.Field>

				<SignUp.Field name="confirmPassword">
					<SignUp.Label>Confirm password</SignUp.Label>
					<SignUp.Input type="password" placeholder="*******" />
					<SignUp.Message />
				</SignUp.Field>

				<p>
					Already have an account?{" "}
					<Link to="/auth/login" className="underline">
						login
					</Link>
				</p>

				<Button type="submit" disabled={isPending}>
					{isPending ? (
						<Icon name="loader-circle" className="animate-spin" />
					) : null}
					Sign up
				</Button>
			</Form>
		</SignUp.FormProvider>
	);
}
