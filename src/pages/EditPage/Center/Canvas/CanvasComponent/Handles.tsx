import React, { memo, useRef } from 'react';
import styles from './Handles.module.less'
import classNames from 'classnames';
import useEditStore, { updateComponentStyle } from 'src/store/editStore';
import { recordSnapphoto } from 'src/store/historyStore';

const HANDLE_POSITION = [
	'top-left', 'top', 'top-right',
	'left', 'right',
	'bottom-left', 'bottom', 'bottom-right',
] as const;

type HandlePosition = typeof HANDLE_POSITION[number];

interface PropsType {
	compKey: string;
	canvasElement: null | HTMLDivElement;
}

const getChanges = (offsetX: number, offsetY: number, pos: HandlePosition) => {
	let res = {
		dleft: pos.indexOf('left') >= 0 ? offsetX : 0,
		dtop: pos.indexOf('top') >= 0 ? offsetY : 0,
		dwidth: pos.indexOf('left') >= 0 ? -offsetX : offsetX,
		dheight: pos.indexOf('top') >= 0 ? -offsetY : offsetY,
	};
	
	if(!(pos.indexOf('left') >= 0 || pos.indexOf('right') >= 0)) res.dwidth = 0;
	if(!(pos.indexOf('top') >= 0 || pos.indexOf('bottom') >= 0)) res.dheight = 0;
	return res;
}

const Handles = memo((props: PropsType) => {
	
	const { compKey } = props;
	const resizeStartPositionRef = useRef({x: 0, y:0});;
	const directionRef = useRef<HandlePosition>('top');
	const resziedCompStyleRef = useRef({width: 0, height: 0, top: 0, left: 0 })
	const resizeRAFId = useRef<number | null>(0)

	const handleResizeStart = (e: React.PointerEvent<HTMLDivElement>, pos: HandlePosition ) => {
		e.stopPropagation();
		e.currentTarget.setPointerCapture(e.pointerId);
		recordSnapphoto();
		directionRef.current = pos;
		resizeStartPositionRef.current = {
			x: e.pageX,
			y: e.pageY,
		}
		const comp = useEditStore.getState().canvas.comps.find((c) => c.key === compKey);
		resziedCompStyleRef.current = {
			width: parseInt(String(comp?.style.width)) || 0,
			height: parseInt(String(comp?.style.height)) || 0,
			top: parseInt(String(comp?.style.top)) || 0,
			left: parseInt(String(comp?.style.left)) || 0,
		};
		console.log(resziedCompStyleRef.current);
	}
	
	const handleResizing = (e: React.PointerEvent<HTMLDivElement>) => {
		if(!e.currentTarget.hasPointerCapture(e.pointerId)) return ;
		e.stopPropagation();
		function resize() {
			const offsetX = e.pageX - resizeStartPositionRef.current.x;
			const offsetY = e.pageY - resizeStartPositionRef.current.y;
			const rect = resziedCompStyleRef.current;
			const changes =  getChanges(offsetX, offsetY, directionRef.current);
			const newStyle = {
				width: rect.width + changes.dwidth + 'px',
				height: rect.height + changes.dheight + 'px',
				top: rect.top + changes.dtop + 'px',
				left: rect.left + changes.dleft + 'px',
			}
			updateComponentStyle(compKey, newStyle);
		}
		if(resizeRAFId.current !== null) {
			cancelAnimationFrame(resizeRAFId.current);
		}
		resizeRAFId.current = requestAnimationFrame(resize);
	}
	
	const handleResizingDown = (e: React.PointerEvent<HTMLDivElement>) => {
		if(!e.currentTarget.hasPointerCapture(e.pointerId)) return ;
		e.stopPropagation();
		if(resizeRAFId.current !== null) {
			cancelAnimationFrame(resizeRAFId.current);
		}
		const offsetX = e.pageX - resizeStartPositionRef.current.x;
		const offsetY = e.pageY - resizeStartPositionRef.current.y;
		if (offsetX === 0 && offsetY === 0) return;
		const rect = resziedCompStyleRef.current;
		const changes =  getChanges(offsetX, offsetY, directionRef.current);
		const newStyle = {
			width: rect.width + changes.dwidth + 'px',
			height: rect.height + changes.dheight + 'px',
			top: rect.top + changes.dtop + 'px',
			left: rect.left + changes.dleft + 'px',
		}
		updateComponentStyle(compKey, newStyle);
	}

	return (
		<>
			{
				HANDLE_POSITION.map((pos) => {
					return (
						<div 
							className={classNames(styles[pos], styles.handle)}
							onPointerDown={
								(e) => { handleResizeStart(e, pos); }
							}
							onPointerMove={handleResizing}
							onPointerUp={handleResizingDown}
							key={pos}
						>
						</div>
					);
				})
			}
		</>
	);
})

export default Handles;
