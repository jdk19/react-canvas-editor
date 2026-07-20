import type React from "react";

export type Style = React.CSSProperties;

export interface Canvas {
	title: string;
	style: Style;
	comps: Array<ComponentWithKey>;
}

export interface Component {
	type: number;
	style: Style;
	value: string;
	onClick?: string;
}

export interface ComponentWithKey extends Component{
	key: string;	
}

export interface EditStoreState {
	canvas: Canvas;
}

export type AddComponent = (component: ComponentWithKey) => void;

export interface EditStoreAction {
	addComponent: AddComponent;
}

export interface EditStore extends EditStoreState, EditStoreAction {}
