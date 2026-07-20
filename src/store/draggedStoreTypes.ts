import type { ComponentWithKey } from "./editStoreTypes";

export interface DraggedStoreState {
	draggedComponent: ComponentWithKey | null;
}

export interface DraggedStoreAction {
	setDraggedComponent: (component: ComponentWithKey | null) => void;
	getDraggedComponent: () => ComponentWithKey | null;
}
