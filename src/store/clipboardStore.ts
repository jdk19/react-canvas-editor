import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { ComponentWithKey } from "./editStoreTypes";
import { cloneDeep } from "lodash";
import useEditStore from "./editStore";
import useSelectedCompsStore from "./selectedCompStore";
import { v4 as uuidv4 } from "uuid";
import { recordSnapphoto } from "./historyStore";

interface ClipboardState {
	clipboard: ComponentWithKey[];
}

const useClipboardStore = create<ClipboardState>()(
	immer(() => ({
		clipboard: [],
	}))
)

export function addToClipboard(...comps: Array<ComponentWithKey>) {
	for(const comp of comps) {
		useClipboardStore.setState((draft) => { draft.clipboard.push(cloneDeep(comp)) })		
	}
}

export function clearClipboard() {
	useClipboardStore.setState((draft) => { draft.clipboard = []; })
}

export function copySelectedComps() {
	const comps = useEditStore.getState().canvas.comps;
	const selectedKeys = useSelectedCompsStore.getState().selectedKeys;
	clearClipboard();
	for(const comp of comps) {
		if(selectedKeys.has(comp.key)) {
			addToClipboard(comp)	
		}
	}
}

export function pasteComps() {
	const copiedComps = useClipboardStore.getState().clipboard;
	recordSnapphoto();
	useEditStore.setState((draft) => {
		for(const comp of copiedComps) {
			let newComp = cloneDeep(comp);
			newComp.key = uuidv4();
			newComp.style.top = ((parseInt(String(newComp.style.top))  || 0) + 10) + 'px';
			newComp.style.left = ((parseInt(String(newComp.style.left))  || 0) + 10) + 'px';
			draft.canvas.comps.push(newComp);
		}
	})	
}

export default useClipboardStore;
