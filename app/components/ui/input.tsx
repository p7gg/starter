import { cx } from "~/modules/utils";

interface InputProps extends React.ComponentProps<"input"> {}
const Input = (props: InputProps) => {
	return (
		<input
			{...props}
			className={cx(
				"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				props.className,
			)}
		/>
	);
};
Input.displayName = "Input";

export { Input, type InputProps };
