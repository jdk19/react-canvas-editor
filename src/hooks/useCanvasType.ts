import { useSearchParams } from "react-router"

const useCanvasType = (): [string, (type: string) => void] => {
	const [searchParams, setSearchParams] = useSearchParams();
	const type = searchParams.get('type') || 'content';
	const setCanvasType = (type: string) => {
		 setSearchParams(prev => {
			 prev.set('type', type);   // 在已有参数基础上改,不是整个替换
			 return prev;              // 一定要 return,箭头函数花括号体不会自动返回
     });
	}
	return [type, setCanvasType];
}

export default useCanvasType;
