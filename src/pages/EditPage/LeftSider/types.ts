import type { defaultComponentStyle } from "src/utils/const";

export interface IconItem  {
	id: ComponentType,
	name: string,
	title: string,
} 

export interface IconSubItem  {
	kind: 'icon';
	id: number,
	name: string,
	title: string,
}

export interface ImageSubItem {
	kind: 'image';
	value: string;
	style: typeof defaultComponentStyle;
}

export type SubItemType = IconSubItem[] | ImageSubItem[];

export const ComponentType = {
	Text: 'Text',
	Image: 'Image',
	Graph: 'Graph',	
} as const;

export type ComponentType = (typeof ComponentType)[keyof typeof ComponentType]
