import type React from 'react';
import { memo } from 'react';


const Image = memo(({value, style} : {value: string; style: React.CSSProperties}) => {
	return (
		<img style={style} src={value} alt=""></img>
	);
})

export default Image;
