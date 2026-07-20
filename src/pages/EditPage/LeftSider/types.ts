export interface IconItem  {
	id: ComponentType,
	name: string,
	title: string,
} 

export interface IconSubItem  {
	id: number,
	name: string,
	title: string,
} 

export const ComponentType = {
	Text: 'Text',
	Image: 'Image',
	Graph: 'Graph',	
} as const;

export type ComponentType = (typeof ComponentType)[keyof typeof ComponentType]
