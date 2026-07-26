import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const initialState = {
	selectedKeys: new Set<string>(),
};

const useSelectedCompsStore = create<typeof initialState>()(
	devtools(
		immer(() => initialState),
		{
			name: 'SelectedCompsStore',
		}
	)
);

export const addSelectedComp = (key: string) => {
	useSelectedCompsStore.setState(
		(draft) => { draft.selectedKeys.add(key) },
		false,
		'addSelectedComp'
	)	
}

export const removeSelectedComp = (key: string) => {
	useSelectedCompsStore.setState(
		(draft) => { draft.selectedKeys.delete(key) },
		false,
		'removeSelectedComp'
	)	
}

export const clearSelectedComps = () => {
	useSelectedCompsStore.setState(
		(draft) => { draft.selectedKeys.clear() },
		false,
		'clearSelectedComps'
	)	
}

export default useSelectedCompsStore;
