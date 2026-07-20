import classNames from "classnames";
import type { IconSubItem } from "./types";
import styles from './FlyoutPanel.module.less';
import useEditStore from "src/store/editStore";
import type { Style } from "src/store/editStoreTypes";
import { v4 as uuidv4 } from "uuid";
import useDraggedStore from "src/store/draggedStore";

export interface Component {
	type: number;
	style: Style;
	value: string;
	onClick?: string;
}

export interface ComponentWithKey extends Component{
	key: number;	
}

const FlyoutPanel = ({ items } : { items: IconSubItem[] | undefined }) => {
		const addComponent = useEditStore(state => state.addComponent);
		const setDraggedComponent = useDraggedStore(state => state.setDraggedComponent)
		return (
			<div className={styles.panel}>
				{
					items?.map((item) => 
						<div 
							key={item.id} className={classNames(styles.iconContainer)}
							style={{cursor: 'default'}}
							onClick={
								() => addComponent({type: item.id, style: {}, value: item.title, key: uuidv4()})
							}
							draggable={true}
							onDragStart={
								() => { 
									setDraggedComponent({
										type: item.id, 
										style: {}, 
										value: item.title, 
										key: uuidv4()
									})
								}
							}
							onDragEnd={
								() => {
									setDraggedComponent(null)
								}
							}
						>
							<i 
								className={classNames("icon", "iconfont", `icon-${item.name}`, 
								styles.icon)}
							>
							</i>
							<span>{item.title}</span>
						</div>
					)
				}	
			</div>
		)	
}

export default FlyoutPanel;
