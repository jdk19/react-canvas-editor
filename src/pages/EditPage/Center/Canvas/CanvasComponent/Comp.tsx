import Text from "./Text";
import Image from "./Image";
import Graph from "./Graph";
import { ComponentType } from "src/pages/EditPage/LeftSider/types";
import { omit, pick } from 'lodash'
import classNames from "classnames";
import styles from './Comp.module.less'
import { memo } from "react";
import type { ComponentWithKey } from "src/store/editStoreTypes";
import Handles from "./Handles";

const COMPONENT_REGISTRY = {
	Text: Text,
	Image: Image,
	Graph: Graph,
};

interface CompPropsType {
	compKey: string;
	isSelected: boolean;
	type: ComponentType;
	value: string;
	style: React.CSSProperties;
	onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
	onPointerMove: React.PointerEventHandler;
	onPointerUp: (event: React.PointerEvent<HTMLDivElement>) => void;
	comp: ComponentWithKey;
	canvasElement: null | HTMLDivElement; 
};

const Comp = memo((props: CompPropsType) => {
	let { type, isSelected, onPointerUp, onPointerDown, compKey, comp, onPointerMove,
				canvasElement,
				...rest } = props;
  const Comp = COMPONENT_REGISTRY[type];

	let outerStyle = {
		...pick(rest.style, ['top', 'left', 'position', 'width', 'height']),
		// transform: 'translate(-50%, -50%)',
	}
	
	outerStyle.width = `calc(${outerStyle.width} + 0.1rem)`;	
	outerStyle.height = `calc(${outerStyle.height} + 0.1rem)`;	
	rest.style = omit(rest.style, ['top', 'left', 'position', ]);


	return (
		<div
			style={outerStyle}
			className={classNames({[styles.selected]: isSelected}, styles.componentContainer)}
			data-key={compKey}
			onPointerUp={onPointerUp} onPointerDown={onPointerDown} onPointerMove={onPointerMove}
		>
			<Comp { ...rest } compKey={compKey} />
			{isSelected && <Handles compKey={compKey} canvasElement={canvasElement}/>}
		</div>
	)
})

export default Comp
