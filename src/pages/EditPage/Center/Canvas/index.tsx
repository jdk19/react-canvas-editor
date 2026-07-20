import classNames from "classnames";
import useEditStore from "src/store/editStore";
import styles from './index.module.less'
import type React from "react";
import useDraggedStore from "src/store/draggedStore";
import Text from "./CanvasComponent/Text";
import Image from "./CanvasComponent/Image";
import Graph from "./CanvasComponent/Graph";

const Canvas = () => {
	const canvasSotre = useEditStore(state => state.canvas);
	const addComponent = useEditStore(state => state.addComponent);
	const getDraggedComponent = useDraggedStore(state => state.getDraggedComponent);
	const { comps } = canvasSotre;
	
	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		console.log(event);
		event.preventDefault();
		const draggedComponent = getDraggedComponent();
		// console.log(draggedComponent);
		if(draggedComponent !== null) {
			const canvasRect = event.currentTarget.getBoundingClientRect();
			const left = event.clientX - canvasRect.left;
			const	top = event.clientY - canvasRect.top;
			addComponent({
				...draggedComponent,
				style: { 
					...draggedComponent.style,
					position: 'absolute',
					top: top,
					left: left,
				}
			});
		}
	}
	return (
		<div 
			className={classNames(styles.canvasContainer)} 
			style={canvasSotre.style}	
			onDragOver={(event) => { event.preventDefault() }}
			onDrop={
				handleDrop
			}
		>
			{
				comps.map(({value, key, style, type}) => {
					return (
						<>
						{type === 'Image' && <Image value={value} style={style} />}
						{type === 'Text' && <Text value={value}/>}
						{type === 'Graph' && <Graph value={value} style={style}/>}
						</>
					)
				})
			}
		</div>
	);
}

export default Canvas;
