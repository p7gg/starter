import * as LabelPrimitive from "@radix-ui/react-label";
import { cx } from "~/modules/utils";

const labelVariants =
	"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {}
const Label = (props: LabelProps) => (
	<LabelPrimitive.Root
		{...props}
		className={cx(labelVariants, props.className)}
	/>
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label, type LabelProps };
