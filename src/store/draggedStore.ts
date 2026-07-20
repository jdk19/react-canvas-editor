import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { DraggedStoreAction, DraggedStoreState } from "./draggedStoreTypes";

const useDraggedStore = create<DraggedStoreState & DraggedStoreAction>()(
	immer((set, get) => ({
		draggedComponent: null,
		setDraggedComponent: (component) => set((state) => { 
			state.draggedComponent = component 
			console.log(component);
		}),
		getDraggedComponent: () => get().draggedComponent,
	}))
)

export default useDraggedStore;
