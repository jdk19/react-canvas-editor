import classNames from "classnames";
import useEditStore, { clearCanvas, removeComponentsByKey, updateComponentStyle } from "src/store/editStore";
import styles from './index.module.less'
import type React from "react";
import useDraggedStore from "src/store/draggedStore";
import useCanvasId from "src/hooks/useCanvasId";
import { memo, useCallback, useEffect, useRef } from "react";
import { fetchCanvas } from "src/store/editStore";
import useSelectedCompsStore, { addSelectedComp, clearSelectedComps, removeSelectedComp } from "src/store/selectedCompStore";
import Comp from './CanvasComponent/Comp'
import useMouse from "src/hooks/useMouse";
import { copySelectedComps, pasteComps } from "src/store/clipboardStore";
import { recordSnapphoto, redo, resetHistory, undo } from "src/store/historyStore";

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
	const [mousePositionRef, canvasRef, canvasElement] = useMouse();
	const isDraggingRef = useRef(false);
	const dragStartPositionRef = useRef<Position>(mousePositionRef.current);
	const dragStartCompStyleRef = useRef({top: 0, left: 0});
	const rafIdRef = useRef<number | null>(null);
	
	const [canvasId] = useCanvasId();
	useEffect(() => {
		fetchCanvas(canvasId);
		if(!canvasId) clearCanvas();
		resetHistory();
	}, [canvasId])
	
	useEffect(() => {
		const cancleSelect = (e: PointerEvent) => {
			if (e.target === canvasElement) {  // 只有点在画布空白处才取消选中
				clearSelectedComps();
			}
		}
		document.addEventListener('pointerup', cancleSelect);
		return () => document.removeEventListener('pointerup', cancleSelect);
	}, [canvasElement])

	useEffect(() => {
		const handleClip = (e: KeyboardEvent) => {
			if(e.key === 'c' && (e.ctrlKey || e.metaKey)) {
				copySelectedComps();
			}
		}
		const handlePaste = (e: KeyboardEvent) => {
			if(e.key === 'v' && (e.ctrlKey || e.metaKey)) {
				pasteComps();
			}
		}
		document.addEventListener('keydown', handleClip);
		document.addEventListener('keydown', handlePaste);
		return () => {
			document.removeEventListener('keydown', handleClip);
			document.removeEventListener('keydown', handlePaste);
		}
	}, [])

	
	useEffect(() => {
		const handleDelete = (e: KeyboardEvent) => {
			if(e.key === 'Delete' || e.key === 'Backspace') {
				recordSnapphoto();
				removeComponentsByKey(...Array.from(useSelectedCompsStore.getState().selectedKeys));
			}
		}

		document.addEventListener('keydown', handleDelete);
		return () => {
			document.removeEventListener('keydown', handleDelete);
		}
	}, [])

	useEffect(() => {
		const handleUndoRedo = (e: KeyboardEvent) => {
			if(e.key.toLowerCase() !== 'z' || !(e.ctrlKey || e.metaKey)) return;
			e.preventDefault();
			if(e.shiftKey) {
				redo();
			} else {
				undo();
			}
		}
		document.addEventListener('keydown', handleUndoRedo);
		return () => {
			document.removeEventListener('keydown', handleUndoRedo);
		}
	}, []);

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const draggedComponent = getDraggedComponent();
		if(draggedComponent === null) return ;
		const canvasRect = event.currentTarget.getBoundingClientRect();
		const left = event.clientX - canvasRect.left;
		const	top = event.clientY - canvasRect.top;
		
		const exsited = canvasStore.comps.some(comp => comp.key === draggedComponent.key);
		recordSnapphoto();
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
		recordSnapphoto();
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
		if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
		if(!isDraggingRef.current) return ;
		e.stopPropagation();
		e.preventDefault();
		const key = e.currentTarget.dataset.key!;
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
			if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
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
			
			const currentPosition: Position = mousePositionRef.current;
			const offsetX = currentPosition.x - dragStartPositionRef.current.x;
			const offsetY = currentPosition.y - dragStartPositionRef.current.y;
			if (offsetX === 0 && offsetY === 0) return;
			const newStyle = {
				top: dragStartCompStyleRef.current.top + offsetY + 'px',
				left: dragStartCompStyleRef.current.left + offsetX + 'px'
			}
			updateComponentStyle(key, newStyle);
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
								canvasElement={canvasElement}
							/>
					)
				})
			}
		</div>
	);
})

export default Canvas;
