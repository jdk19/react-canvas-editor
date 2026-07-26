import type React from 'react';
import { memo } from 'react';

interface CompPropsType { 
	value: string,
	style: React.CSSProperties,
};

const Image = memo(({ value, style } : CompPropsType) => {
	return (
		<img style={style} src={value} alt="">
		</img>
	);
})

export default Image;
