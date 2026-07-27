import Text from "./Text";
import Image from "./Image";
import Graph from "./Graph";
import { ComponentType } from "src/pages/EditPage/LeftSider/types";
import { omit, pick } from 'lodash'
import classNames from "classnames";
import styles from './Comp.module.less'
import { memo } from "react";
import useDraggedStore from "src/store/draggedStore";
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
	onPointerUp: (event: React.PointerEvent<HTMLDivElement>) => void;
	comp: ComponentWithKey;
};

const Comp = memo((props: CompPropsType) => {
	let { type, isSelected, onPointerUp, onPointerDown, compKey, comp,
				...rest } = props;
  const Comp = COMPONENT_REGISTRY[type];
	let outerStyle = {
		...pick(rest.style, ['top', 'left', 'position', 'width', 'height']),
		transform: 'translate(-50%, -50%)',
	}
	
	outerStyle.width = `calc(${outerStyle.width} + 0.1rem)`;	
	outerStyle.height = `calc(${outerStyle.height} + 0.1rem)`;	
	const setDraggedComponent = useDraggedStore(state => state.setDraggedComponent);
	rest.style = omit(rest.style, ['top', 'left', 'position', ]);
	
	const handleDragStart = () => {
		setDraggedComponent(comp);	
	}

	const handleResize = (e: React.PointerEvent<HTMLDivElement>) => {
		e.stopPropagation();
	}

	return (
		<div
			style={outerStyle}
			className={classNames({[styles.selected]: isSelected}, styles.componentContainer)}
			data-key={compKey} draggable={true}
			onPointerUp={onPointerUp} onPointerDown={onPointerDown} onDragStart={handleDragStart}
		>
			<Comp { ...rest } />
			{isSelected && <Handles onPointerDown={handleResize}/>}
		</div>
	)
})

export default Comp
