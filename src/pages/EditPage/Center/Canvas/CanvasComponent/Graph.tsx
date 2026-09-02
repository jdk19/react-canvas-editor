import type React from 'react';
import { memo } from 'react';
import sharedStyles from './shared.module.less';
interface CompPropsType { 
	value: string,
	style: React.CSSProperties,
	compKey: string;
};

const Graph = memo(({value, style}: CompPropsType) => {
	return (
		<div style={style} className={sharedStyles.container}>
			{value}
		</div>
	)	
})

export default Graph;
