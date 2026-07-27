import { useEffect, useState, useCallback } from "react"

const initialValue = {
	x: 0,
	y: 0,
	top: 0,
	left: 0,
	width: 0,
	height: 0,
};

const useMouse = () => {
	const [position, setPosition] = useState(initialValue);
	const [element, setElement] = useState<null | HTMLDivElement>(null);

	const callbackRef = useCallback((node: HTMLDivElement | null) => {
			setElement(node)
	}, [])
	
	useEffect(() => {
		function updatePosition(e: PointerEvent) {
			if(!element) return;
			const rect = element.getBoundingClientRect();
			const newPosition = {
				x: e.pageX,
				y: e.pageY,
				top: e.clientY - rect.top,
				left: e.clientX - rect.left,
				width: rect.width,
				height: rect.height,
			};
			setPosition(newPosition);
		}

		if(element) {
			element.addEventListener('pointermove', updatePosition);
			return () => { element.removeEventListener('pointermove', updatePosition); }
		}
	}, [element])
	
	return [position, callbackRef] as const;
}

export default useMouse;
