import { invariant } from "@epic-web/invariant";
import { arktypeResolver } from "@hookform/resolvers/arktype";
import { type ArkErrors, type Type, type } from "arktype";
import React from "react";
import * as rhf from "react-hook-form";
import { Input as BaseInput, type InputProps } from "~/components/ui/input";
import { Label as BaseLabel, type LabelProps } from "~/components/ui/label";
import { cx } from "./utils";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function createArkForm<TSchema extends Type<any>>(
	schema: TSchema,
	{
		raw = true,
	}: {
		raw?: boolean;
	} = {},
) {
	type FormInput = TSchema["inferIn"];
	type FormOutput = TSchema["inferOut"];
	type FormContext = unknown;

	const resolver = arktypeResolver(schema, undefined, {
		raw,
	});

	interface UseArkFormProps
		extends Omit<rhf.UseFormProps<FormInput, FormContext>, "resolver"> {}
	interface UseArkFormReturn
		extends rhf.UseFormReturn<FormInput, FormContext, FormOutput> {
		/**
		 * A unique ID for this form.
		 */
		id: string;
	}
	function useForm(options?: UseArkFormProps) {
		const form = rhf.useForm({
			resolver,
			mode: "onSubmit",
			reValidateMode: "onChange",
			...options,
		}) as UseArkFormReturn;
		form.id = React.useId();
		return form;
	}

	type UseFormContext = () => UseArkFormReturn;
	const useFormContext = rhf.useFormContext as unknown as UseFormContext;

	const useFormState = rhf.useFormState<FormInput>;

	type UseController = <TFieldName extends rhf.FieldPath<FormInput>>(
		props: rhf.UseControllerProps<FormInput, TFieldName>,
	) => rhf.UseControllerReturn<FormInput, TFieldName>;
	const useController = rhf.useController as UseController;

	type UseFieldArray = <
		TFieldArrayName extends rhf.FieldArrayPath<FormInput>,
		TKeyName extends string = "id",
	>(
		props: rhf.UseFieldArrayProps<FormInput, TFieldArrayName, TKeyName>,
	) => rhf.UseFieldArrayReturn<FormInput, TFieldArrayName, TKeyName>;
	const useFieldArray = rhf.useFieldArray as UseFieldArray;

	interface FieldContextValue<
		TFieldName extends rhf.FieldPath<FormInput> = rhf.FieldPath<FormInput>,
	> extends rhf.UseControllerReturn<FormInput, TFieldName> {
		id: string;
		formDescriptionId: string;
		formMessageId: string;
	}
	const FieldContext = React.createContext<FieldContextValue | null>(null);
	function useField<
		TFieldName extends rhf.FieldPath<FormInput> = rhf.FieldPath<FormInput>,
	>() {
		const ctx = React.use(FieldContext);
		invariant(ctx, "useField should be used within <Form.Field>");
		return ctx as FieldContextValue<TFieldName>;
	}

	function useWatch(props: {
		defaultValue?: rhf.DeepPartialSkipArrayKey<FormInput>;
		control?: rhf.Control<FormInput>;
		disabled?: boolean;
		exact?: boolean;
	}): rhf.DeepPartialSkipArrayKey<FormInput>;
	function useWatch<
		TFieldName extends rhf.FieldPath<FormInput> = rhf.FieldPath<FormInput>,
	>(props: {
		name: TFieldName;
		defaultValue?: rhf.FieldPathValue<FormInput, TFieldName>;
		control?: rhf.Control<FormInput>;
		disabled?: boolean;
		exact?: boolean;
	}): rhf.FieldPathValue<FormInput, TFieldName>;
	function useWatch<
		TFieldNames extends ReadonlyArray<rhf.FieldPath<FormInput>> = ReadonlyArray<
			rhf.FieldPath<FormInput>
		>,
	>(props: {
		name: readonly [...TFieldNames];
		defaultValue?: rhf.DeepPartialSkipArrayKey<FormInput>;
		control?: rhf.Control<FormInput>;
		disabled?: boolean;
		exact?: boolean;
	}): rhf.FieldPathValues<FormInput, TFieldNames>;
	function useWatch(): rhf.DeepPartialSkipArrayKey<FormInput>;
	function useWatch(props?: rhf.UseWatchProps<FormInput>) {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		return rhf.useWatch(props as any);
	}

	type Controller = <TFieldName extends rhf.FieldPath<FormInput>>(
		props: rhf.ControllerProps<FormInput, TFieldName>,
	) => React.ReactElement;
	const Controller = rhf.Controller as Controller;

	const FormProvider = rhf.FormProvider<FormInput, FormContext, FormOutput>;

	interface FieldProps<
		TFieldName extends rhf.FieldPath<FormInput> = rhf.FieldPath<FormInput>,
	> extends Omit<React.ComponentProps<"div">, keyof rhf.UseControllerProps>,
			rhf.UseControllerProps<FormInput, TFieldName> {}
	function Field<
		TFieldName extends rhf.FieldPath<FormInput> = rhf.FieldPath<FormInput>,
	>({
		name,
		rules,
		shouldUnregister,
		defaultValue,
		control,
		disabled,
		...props
	}: FieldProps<TFieldName>) {
		const id = React.useId();
		const { field, fieldState, formState } = useController({
			name,
			control,
			defaultValue,
			disabled,
			rules,
			shouldUnregister,
		});

		const formDescriptionId = `${id}-form-item-description`;
		const formMessageId = `${id}-form-item-message`;

		return (
			<FieldContext
				value={{
					id,
					formDescriptionId,
					formMessageId,
					field,
					fieldState,
					formState,
				}}
			>
				<div
					className={cx("flex flex-col gap-y-2", props.className)}
					{...props}
				/>
			</FieldContext>
		);
	}

	function Label(props: LabelProps) {
		const {
			id,
			fieldState: { error },
		} = useField();

		return (
			<BaseLabel
				{...props}
				className={cx(error && "text-destructive", props.className)}
				htmlFor={id}
			/>
		);
	}

	function Input(props: InputProps) {
		const {
			id,
			formDescriptionId,
			formMessageId,
			field,
			fieldState: { error },
		} = useField();

		return (
			<BaseInput
				aria-describedby={
					!error
						? `${formDescriptionId}`
						: `${formDescriptionId} ${formMessageId}`
				}
				aria-invalid={!!error}
				{...props}
				id={id}
				{...field}
			/>
		);
	}

	const Description = (props: React.ComponentProps<"p">) => {
		const { formDescriptionId } = useField();

		return (
			<p
				{...props}
				id={formDescriptionId}
				className={cx("text-[0.8rem] text-muted-foreground", props.className)}
			/>
		);
	};

	const Message = (props: React.ComponentProps<"p">) => {
		const {
			fieldState: { error },
			formMessageId,
		} = useField();
		const body = error ? String(error.message) : props.children;

		if (!body) {
			return null;
		}

		return (
			<p
				{...props}
				id={formMessageId}
				className={cx(
					"font-medium text-[0.8rem] text-destructive",
					props.className,
				)}
			>
				{body}
			</p>
		);
	};

	function parseFormData(
		formData: FormData,
	): [data: FormOutput, error: null] | [data: null, error: ArkErrors] {
		const _schema = type("FormData.parse").pipe(schema as Type<unknown>);
		const out = _schema(formData);

		return out instanceof type.errors ? [null, out] : [out, null];
	}

	return {
		useForm,
		useController,
		useFieldArray,
		useFormContext,
		useFormState,
		useWatch,
		Controller,
		FormProvider,
		parseFormData,
		useField,
		Field,
		Label,
		Input,
		Description,
		Message,
	};
}
