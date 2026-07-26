import type React from 'react';
import { memo } from 'react';

interface CompPropsType { 
	value: string,
	style: React.CSSProperties,
};

const Graph = memo(({value, style}: CompPropsType) => {
	return (
		<div style={style}>
			{value}
		</div>
	)	
})

export default Graph;
