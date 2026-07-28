import { pick } from 'lodash';
import type { ComponentWithKey } from 'src/store/editStoreTypes';

export interface RectType { top: number; left: number; width: number; height: number; }
export interface PositionType { x: number; y: number; }

export function calcSelectBoxShape(
	anchor: PositionType, current: PositionType, origin: PositionType
): RectType {
	const diffX = current.x - anchor.x;
	const diffY = current.y - anchor.y;
	const top = (diffY < 0 ? anchor.y + diffY : anchor.y) - origin.y;
	const left = (diffX < 0 ? anchor.x + diffX : anchor.x) - origin.x;
	return {
		top: top,
		left: left,
		width: Math.abs(diffX),
		height: Math.abs(diffY),
	}
}

export function getRect(comp: ComponentWithKey): RectType {
	let rect: RectType = {
		top: 0,
		left: 0,
		width: 0,
		height: 0,
	}
	const compNode = document.querySelector(`[data-key="${comp.key}"]`);
	if (compNode) {
		rect = pick(compNode.getBoundingClientRect(), ['top', 'left', 'width', 'height']);
	}
	return rect;
}

export function isCataining(r1: RectType, r2: RectType) {
	function calc(r1: RectType, r2: RectType) { 
		return r1.top <= r2.top &&
						r1.left <= r2.left &&
						r1.top + r1.height >= r2.top + r2.height &&
						r1.left + r1.width >= r2.left + r2.width;
	}
	return calc(r1, r2) || calc(r2, r1);
}

export function isPointInBox(point: PositionType, box: RectType): boolean {
      return point.x >= box.left &&
              point.x <= box.left + box.width &&
              point.y >= box.top &&
              point.y <= box.top + box.height;
}

export function getSelectedKeys(box: RectType, origin: PositionType, comps: ComponentWithKey[]): string[] {
	const selectedKeys: string[] = [];
	for (const comp of comps) {
		const rect = getRect(comp);
		rect.top -= origin.y;
		rect.left -= origin.x;
		if (isCataining(box, rect)) {
			selectedKeys.push(comp.key);
		}
	}
	return selectedKeys;
}
