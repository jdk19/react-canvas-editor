import type { Canvas } from "./editStoreTypes"
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import useEditStore from "./editStore"
import { devtools } from "zustand/middleware"

const initialState = {
	past: new Array<Canvas>(),
	future: new Array<Canvas>(),
}

const useHistoryStore = create<typeof initialState>()(
	devtools(
		immer(() => initialState),
		{
			name: 'historyStore'
		}
	)
)

export function undo() {
	const past = useHistoryStore.getState().past;
	if (past.length === 0) return ;
	const lastState = past[past.length - 1];
	const currentState = useEditStore.getState().canvas;
	useHistoryStore.setState((draft) => {
		draft.past.pop();
		draft.future.push(currentState);
	})
	useEditStore.setState((draft) => {
		draft.canvas = lastState;
	})
}

export function redo() {
	const future = useHistoryStore.getState().future;
	const next = future[future.length - 1];	
	const currentState = useEditStore.getState().canvas;
	useHistoryStore.setState((draft) => {
		draft.future.pop();
	})
	if(next === undefined) return ;
	useEditStore.setState((draft) => {
		draft.canvas = next;
	})
	useHistoryStore.setState(draft => {
		draft.past.push(currentState);
	})
}

export function resetHistory() {
	useHistoryStore.setState((draft) => {
		draft.past = [];
		draft.future = [];
	}, false, 'resetHistory')
}

export function recordSnapphoto() {
	const canvas = useEditStore.getState().canvas;
	const past = useHistoryStore.getState().past;
	if(canvas === past[past.length - 1]) return ;
	useHistoryStore.setState((draft) => {
		draft.future = [];
		draft.past.push(canvas)
	}, false, 'recordSnapphoto')
}

export default useHistoryStore;
