import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Canvas, EditStoreState, EditStoreAction} from './editStoreTypes';
import Axios from 'src/request/Axios';
import { getCanvasByIdEnd, saveCanvasEnd } from 'src/request';
import { devtools } from 'zustand/middleware';

export const saveCanvas = async (
	id: string | null,
	type: string,
	successCallback: (id: string, type: string) => void
) => {
	const canvas = useEditStore.getState().canvas;
	console.log('canvas', canvas, JSON.stringify(canvas));
	const res: any = await Axios.post(saveCanvasEnd, {
		id: id,
		title: canvas.title,
		content: JSON.stringify(canvas),
		type: type,
	})
	console.log(res.data.result.id);
	successCallback(res.data.result.id, res.data.result.type);
}

export const fetchCanvas = async (
	id: string | null	
) => {
	if(id === null) return ;
	const res = await Axios.get(getCanvasByIdEnd + id);
	const canvas = JSON.parse(res.data.result.content);	
	useEditStore.setState({ canvas });
}

export const clearCanvas = () => {
	useEditStore.setState((draft) => { draft.canvas = getDefaultCanvas(); });
}

function getDefaultCanvas(): Canvas {
  return {
    title: "未命名",
    // 页面样式
    style: {
      width: 320,
      height: 568,
      backgroundColor: "#ffffff",
      backgroundImage: "",
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    },
    // 组件
    comps: [],
  };
}

const useEditStore = create<EditStoreState & EditStoreAction>()(
	devtools(
		immer(
			(set) => ({
				canvas: getDefaultCanvas(),
				addComponent: (comp) => { set(draft => {draft.canvas.comps.push(comp)}) }
			})
		),
		{
			name: 'edtiStore',
		}
	)
)

export const updateComponentStyle = (key: string, style: React.CSSProperties) => {
	useEditStore.setState((draft) => {
		draft.canvas.comps.forEach((item, index, comps) => {
			if(item.key === key) {
				Object.assign(comps[index].style, style);
			}
		})
	})
}

export const removeComponentsByKey = (...key: string[]) => {
	const keySet = new Set<string>(key);
	useEditStore.setState((draft) => {
		draft.canvas.comps = draft.canvas.comps.filter((comp) => {
			return !keySet.has(comp.key);	
		})
	})
}

export default useEditStore;
