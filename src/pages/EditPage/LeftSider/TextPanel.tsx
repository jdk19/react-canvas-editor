import useEditStore from "src/store/editStore";
import useDraggedStore from "src/store/draggedStore";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import styles from './TextPanel.module.less'
import { defaultComponentStyle } from "src/utils/const";
import { recordSnapphoto } from "src/store/historyStore";

const TextPanel = ({ items }: any) => {
		const addComponent = useEditStore(state => state.addComponent);
		const setDraggedComponent = useDraggedStore(state => state.setDraggedComponent)
		return (
			<div className={styles.panel}>
				{
					items?.map((item: any) => 
						<div 
							key={item.id} className={classNames(styles.iconContainer)}
							style={{cursor: 'default'}}
							onClick={
								() => {
									recordSnapphoto();
									addComponent({
										type: 'Text',
										style: {...defaultComponentStyle,
										position: 'absolute', top: 0, left: 0},
										value: item.title, key: uuidv4()
									})
								}
							}
							draggable={true}
							onDragStart={
								() => {
									setDraggedComponent({
										type: 'Text', 
										style: {...defaultComponentStyle}, 
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

export default TextPanel;
