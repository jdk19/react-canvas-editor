import { useSearchParams } from "react-router"

const useCanvasId = (): [string | null, (id: string) => void] => {
	const [searchParams, setSearchParams] = useSearchParams();
	const canvasId = searchParams.get('id');
	const setCanvasId = (id: string) => {
		setSearchParams(prev => {
			prev.set('id', id);
			return prev;
		});
	}
	return [canvasId, setCanvasId];
}

export default useCanvasId;
