import { Layout } from 'antd';
import Canvas from './Canvas';
import { useRef, useState } from 'react';
import SelectBox from './SelectBox';
import useEditStore from 'src/store/editStore';
import { addSelectedComp } from 'src/store/selectedCompStore';
import { calcSelectBoxShape, getSelectedKeys } from 'src/utils/selectBox';
import { recordSnapphoto } from 'src/store/historyStore';

const { Content } = Layout;

const defaultStyle = {
	top: '0px',
	left: '0px',
	width: '0px',
	height: '0px',
}

const Center = () => {
	const [position, setPosition] = useState({x: 0, y: 0});
	const selectBoxRef = useRef<HTMLDivElement>(null);
	const isDraggingRef = useRef(false);
	const animationFrameIdRef = useRef<number | null>(null);

	const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		if(e.shiftKey) {
			e.stopPropagation();
			e.currentTarget.setPointerCapture(e.pointerId);
			setPosition({x: e.pageX, y: e.pageY});
			isDraggingRef.current = true;
		}
	}
	
	const handlePoinerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		const pageX = e.pageX;
		const pageY = e.pageY;
		const rect = e.currentTarget.getBoundingClientRect();
		function resize() {
			if(!isDraggingRef.current) return;
				const boxShape = 
					calcSelectBoxShape(position, {x: pageX, y: pageY}, {x: rect.left, y: rect.top});
				const boxStyle: React.CSSProperties = {
						top: `${boxShape.top}px`,
						left: `${boxShape.left}px`,
						width: `${boxShape.width}px`,
						height: `${boxShape.height}px`,
				};
				if(selectBoxRef.current !== null) {
					Object.assign(selectBoxRef.current.style, boxStyle);
				}
		}
		
		function resizePerFrame() {
			if(animationFrameIdRef.current !== null) {
				cancelAnimationFrame(animationFrameIdRef.current);	
			}
			animationFrameIdRef.current = requestAnimationFrame(() => resize())
		}
		resizePerFrame();
	}
	
	const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
		if(isDraggingRef.current === false) return;
		e.stopPropagation();
		e.currentTarget.releasePointerCapture(e.pointerId);
		if (animationFrameIdRef.current !== null) {
			cancelAnimationFrame(animationFrameIdRef.current);
			animationFrameIdRef.current = null;
    }
		isDraggingRef.current = false;
		if(selectBoxRef.current !== null) {
				Object.assign(selectBoxRef.current.style, defaultStyle);
		}
		const rect = e.currentTarget.getBoundingClientRect();
		const origin = {x: rect.left, y: rect.top};
		const boxShape = calcSelectBoxShape(position, {x: e.pageX, y: e.pageY}, origin);

		const comps = useEditStore.getState().canvas.comps;
		const selectedKeys = getSelectedKeys(boxShape, origin, comps);
		selectedKeys.forEach(addSelectedComp);
	}

	return (
		<Content style={{ position: 'relative', userSelect: 'none' }} 
			onPointerDown={handlePointerDown}
			onPointerMove={handlePoinerMove}
			onPointerUp={handlePointerUp}
		>
			<Canvas />
			<SelectBox ref={selectBoxRef}/>
		</Content>
	)
};

export default Center;
