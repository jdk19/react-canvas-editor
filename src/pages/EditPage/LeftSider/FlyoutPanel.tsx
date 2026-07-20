import classNames from "classnames";
import type { ComponentType, SubItemType } from "./types";
import styles from './FlyoutPanel.module.less';
import useEditStore from "src/store/editStore";
import type { Style } from "src/store/editStoreTypes";
import useDraggedStore from "src/store/draggedStore";
import ImagePanel from "./ImagePanel";
import TextPanel from "./TextPanel";
import GraphPanel from "./GraphPanel";

export interface Component {
	type: number;
	style: Style;
	value: string;
	onClick?: string;
}

export interface ComponentWithKey extends Component{
	key: number;	
}

const FlyoutPanel = ({ items, id } : { items: SubItemType | undefined, id: ComponentType | null }) => {
		return (
			<>
				{id === 'Image' && <ImagePanel />}
				{id === 'Text' && <TextPanel items={items} />}
				{id === 'Graph' && <GraphPanel items={items} />}
			</>
		)
		// return (
		// 	<div className={styles.panel}>
		// 		{
		// 			items?.map((item) => 
		// 				<div 
		// 					key={item.id} className={classNames(styles.iconContainer)}
		// 					style={{cursor: 'default'}}
		// 					onClick={
		// 						() => addComponent({type: item.id, style: {}, value: item.title, key: uuidv4()})
		// 					}
		// 					draggable={true}
		// 					onDragStart={
		// 						() => { 
		// 							setDraggedComponent({
		// 								type: item.id, 
		// 								style: {}, 
		// 								value: item.title, 
		// 								key: uuidv4()
		// 							})
		// 						}
		// 					}
		// 					onDragEnd={
		// 						() => {
		// 							setDraggedComponent(null)
		// 						}
		// 					}
		// 				>
		// 					<i 
		// 						className={classNames("icon", "iconfont", `icon-${item.name}`, 
		// 						styles.icon)}
		// 					>
		// 					</i>
		// 					<span>{item.title}</span>
		// 				</div>
		// 			)
		// 		}	
		// 	</div>
		// )	
}

export default FlyoutPanel;
