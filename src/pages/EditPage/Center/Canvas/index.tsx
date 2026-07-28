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
import { isPointInBox } from "src/utils/selectBox";

interface Position {
	x: number;
	y: number;
}
const Canvas = memo(() => {
	const canvasStore = useEditStore(state => state.canvas);
	const addComponent = useEditStore(state => state.addComponent);
	const getDraggedComponent = useDraggedStore(state => state.getDraggedComponent);
	const { comps } = canvasStore;
	const selectedKeys = useSelectedCompsStore(state => state.selectedKeys);
	const [mousePositionRef, canvasRef] = useMouse();
	const isDraggingRef = useRef(false);
	const dragStartPositionRef = useRef<Position>(mousePositionRef.current);
	const dragStartCompStyleRef = useRef({top: 0, left: 0});
	const rafIdRef = useRef<number | null>(null);

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
		isDraggingRef.current = true;
		e.currentTarget.setPointerCapture(e.pointerId);
		const key = e.currentTarget.dataset.key;
		const comp = useEditStore.getState().canvas.comps.find((c) => c.key === key);
		if (!comp) return;

		dragStartPositionRef.current = { ...mousePositionRef.current };  
		dragStartCompStyleRef.current = {                             
						top: parseInt(String(comp.style.top)) || 0,
						left: parseInt(String(comp.style.left)) || 0,
		};
		useDraggedStore.setState((draft) => { draft.draggedComponent = comp; });
	}, [])

	const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
		if(!isDraggingRef.current) return ;
		e.stopPropagation();
		e.preventDefault();
		const key = e.currentTarget.dataset.key!;
		console.log('pointer is moving');
		function changePosition() {
			const currentPosition: Position = mousePositionRef.current;
			const offsetX = currentPosition.x - dragStartPositionRef.current.x;
			const offsetY = currentPosition.y - dragStartPositionRef.current.y;
			const newStyle = {
				top: dragStartCompStyleRef.current.top + offsetY + 'px',
				left: dragStartCompStyleRef.current.left + offsetX + 'px'
			}	
			updateComponentStyle(key, newStyle);
		}
		
		function changePositionPerFrame() {
			if(rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
			}
			rafIdRef.current = requestAnimationFrame(changePosition);
		}
		changePositionPerFrame();
	}, [])

	const handleSelectPointerUp = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			e.stopPropagation();
			e.currentTarget.releasePointerCapture(e.pointerId);
			const key = e.currentTarget.dataset.key!;
			if(rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
			}
			isDraggingRef.current = false;
			const selectedKeys = useSelectedCompsStore.getState().selectedKeys;
			if(!e.shiftKey) {
				clearSelectedComps();
			}
			if(selectedKeys.has(key) && e.shiftKey) {
				removeSelectedComp(key);
			} else {
				addSelectedComp(key);	
			}
			
			const { x, y, top, left, height, width } = mousePositionRef.current;
			const box = e.currentTarget.getBoundingClientRect();
			if(isPointInBox({x, y}, box)) return ;
			if(isPointInBox({x: left, y: top}, {top: 0, left: 0, height, width})) {
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
								onPointerMove={handlePointerMove}
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
