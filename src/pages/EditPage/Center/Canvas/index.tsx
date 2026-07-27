import classNames from "classnames";
import useEditStore, { clearCanvas, updateComponentStyle } from "src/store/editStore";
import styles from './index.module.less'
import type React from "react";
import useDraggedStore from "src/store/draggedStore";
import useCanvasId from "src/hooks/useCanvasId";
import { memo, useCallback, useEffect, useRef } from "react";
import { fetchCanvas } from "src/store/editStore";
import useSelectedCompsStore, { addSelectedComp, clearSelectedComps, removeSelectedComp } from "src/store/selectedCompStore";
import Comp from './CanvasComponent/Comp'
import useMouse from "src/hooks/useMouse";


const Canvas = memo(() => {
	const canvasStore = useEditStore(state => state.canvas);
	const addComponent = useEditStore(state => state.addComponent);
	const getDraggedComponent = useDraggedStore(state => state.getDraggedComponent);
	const { comps } = canvasStore;
	const selectedKeys = useSelectedCompsStore(state => state.selectedKeys);
	const [mousePosition, canvasRef] = useMouse();
	const mousePositionRef = useRef(mousePosition);
	useEffect(() => {
      mousePositionRef.current = mousePosition;
	}, [mousePosition]);
	
	const [canvasId] = useCanvasId();
	useEffect(() => {
		fetchCanvas(canvasId);
		if(!canvasId) clearCanvas();
	}, [canvasId])
	
	useEffect(() => {
		const cancleSelect = () => {
			clearSelectedComps();
		}
		document.addEventListener('pointerup', cancleSelect);
		return () => document.removeEventListener('pointerup', cancleSelect);
	}, [])

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const draggedComponent = getDraggedComponent();
		if(draggedComponent === null) return ;
		const canvasRect = event.currentTarget.getBoundingClientRect();
		const left = event.clientX - canvasRect.left;
		const	top = event.clientY - canvasRect.top;
		
		const exsited = canvasStore.comps.some(comp => comp.key === draggedComponent.key);
		if(exsited) {
			updateComponentStyle(
				draggedComponent.key,
				{ 
					...draggedComponent.style,
					position: 'absolute',
					top: top,
					left: left,
				}
			);
		} else {
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

	const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
		e.stopPropagation();
		e.preventDefault();
		e.currentTarget.setPointerCapture(e.pointerId);
		const comps = useEditStore.getState().canvas.comps;
		const draggedComp = comps.find((comp) => comp.key === e.currentTarget.dataset.key);
		if(draggedComp !== (void 0)) {
			useDraggedStore.setState((draft) => { draft.draggedComponent = draggedComp; });
		}
	}, [])

	const handleSelectPointerUp = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			e.stopPropagation();
			e.currentTarget.releasePointerCapture(e.pointerId);
			const key = e.currentTarget.dataset.key;
			if(!key) return;
			const selectedKeys = useSelectedCompsStore.getState().selectedKeys;
			if(!e.shiftKey) {
				clearSelectedComps();
			}
			if(selectedKeys.has(key) && e.shiftKey) {
				removeSelectedComp(key);
			} else {
				addSelectedComp(key);	
			}
			
			const { top, left, height, width } = mousePositionRef.current;
			if(top > 0 && left > 0 && top < height && left < width) {
				updateComponentStyle(key, {
					left: left + 'px',
					top: top + 'px',
				})
			}
		}, []);

	return (
		<div 
			className={classNames(styles.canvasContainer)} 
			style={canvasStore.style}	
			ref={canvasRef}
			onDragOver={(event) => { event.preventDefault() }}
			onDrop={
				handleDrop
			}
		>
			{
				comps.map((comp) => {
					const {value, key, style, type} = comp;
					return (
							<Comp key={key} type={type} value={value} style={style}
								onPointerDown={handlePointerDown}
								onPointerUp={handleSelectPointerUp}
								isSelected={selectedKeys.has(key)}
								compKey={key}
								comp={comp}
							/>
					)
				})
			}
		</div>
	);
})

export default Canvas;
