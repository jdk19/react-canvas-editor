import classNames from "classnames";
import type { IconItem } from "./types";
import styles from './IconArea.module.less'
import type { ComponentType } from "./types";

interface PropsType {
	items: IconItem[],
	selectedId: string | null,
	onClick: (id: ComponentType) => void;
}

const IconArea = ({ items, selectedId, onClick } : PropsType) => {

	return (
		<div className={classNames(styles.panel)}>
			{
				items.map((item) => 
					<div 
						key={item.id} 
						className={
							classNames(styles.iconContainer, {[styles.selected]: selectedId === item.id})
						}
						onClick={() => onClick(item.id)}
						style={{cursor: 'default'}}
					>
						<i 
							className={
								classNames("icon", "iconfont", `icon-${item.name}`,styles.icon)
							}
						>
						</i>
						<span>{item.title}</span>
					</div>
				)
			}
		</div>
	)
}

export default IconArea;
