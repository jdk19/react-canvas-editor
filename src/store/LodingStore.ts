import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface LoadingStoreState {
	isLoading: boolean;
}

export interface LoadingStoreAction {
	setLoading: (value: boolean) => void,
	getLoding: () => void,
}

const useLoadingStore = create<LoadingStoreState & LoadingStoreAction>()(
	immer((set, get) => ({
		isLoading: false,
		setLoading: (value) => set(state => { state.isLoading = value }),
		getLoding: () => get().isLoading,
	}))
)

export default useLoadingStore;
