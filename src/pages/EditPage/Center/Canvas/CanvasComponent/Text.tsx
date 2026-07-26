import React, { memo } from "react";

interface CompPropsType { 
	value: string,
	style: React.CSSProperties,
};

const Text = memo(({ value, style, }: CompPropsType ) => {
	return (
		<div style={style}>
			{value}
		</div>
	);
})

export default Text;
