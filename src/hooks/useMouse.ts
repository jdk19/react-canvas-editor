import { useEffect, useState, useCallback } from "react"

const initialValue = {
	x: 0,
	y: 0,
	clientX: 0,
	clientY: 0,
}
const useMouse = () => {
	const [position, setPosition] = useState(initialValue);
	const [element, setElement] = useState<null | HTMLDivElement>(null);

	const callbackRef = useCallback((node: HTMLDivElement | null) => {
			setElement(node)
	}, [])
	
	useEffect(() => {
		function updatePostion(e: PointerEvent) {
			const newPosition = {
				x: e.pageX,
				y: e.pageY,
				clientX: e.clientX,
				clientY: e.clientY,	
			};
			setPosition(newPosition);
		}

		element?.addEventListener('pointermove', updatePostion);
		return () => { element?.removeEventListener('pointermove', updatePostion); }
	}, [element])
	
	return [position, callbackRef] as const;
}

export default useMouse;
