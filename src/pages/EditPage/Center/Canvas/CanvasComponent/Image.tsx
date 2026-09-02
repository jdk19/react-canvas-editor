import type React from 'react';
import { memo } from 'react';
import sharedStyles from './shared.module.less'
import { updateComponentStyle } from 'src/store/editStore';

interface CompPropsType {
	value: string,
	style: React.CSSProperties,
	compKey: string;
};

const Image = memo(({ value, style, compKey } : CompPropsType) => {
	const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
		if (style.height !== undefined) return;
		const img = e.currentTarget;
		const width = parseInt(String(style.width)) || img.naturalWidth;
		const height = width * (img.naturalHeight / img.naturalWidth);
		updateComponentStyle(compKey, { height });
	};

	return (
		<div className={sharedStyles.container}>
			<img style={style} src={value} alt="" onLoad={handleLoad}>
			</img>
		</div>
	);
})

export default Image;
