import { cx } from "~/modules/utils";

interface TextareaProps extends React.ComponentProps<"textarea"> {}
const Textarea = (props: TextareaProps) => {
	return (
		<textarea
			{...props}
			className={cx(
				"flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				props.className,
			)}
		/>
	);
};
Textarea.displayName = "Textarea";

export { Textarea };
