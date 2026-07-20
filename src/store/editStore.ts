import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Canvas, EditStoreState, EditStoreAction} from './editStoreTypes';

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
	immer(
		(set) => ({
			canvas: getDefaultCanvas(),
			addComponent: (comp) => { set(draft => {draft.canvas.comps.push(comp)}) }
		})
	)
)

export default useEditStore;
