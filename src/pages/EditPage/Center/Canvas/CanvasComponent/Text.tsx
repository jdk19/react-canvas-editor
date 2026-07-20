import { memo } from "react";

const Text = memo(({ value }: { value: string }) => {
	return (
		<>{value}</>
	);
})

export default Text;
