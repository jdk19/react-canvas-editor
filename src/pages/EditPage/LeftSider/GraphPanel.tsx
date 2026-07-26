import useDraggedStore from "src/store/draggedStore";
import useEditStore from "src/store/editStore";
import {defaultComponentStyle} from "src/utils/const";
import { v4 as uuidv4 } from 'uuid'
import styles from './GraphPanel.module.less'

const defaultStyle = {
  ...defaultComponentStyle,
  width: 120,
  height: 120,
  borderColor: "blue",
  backgroundColor: "blue",
};

const settings = [
  {
    key: "graph0",
    value: "",
    style: {
      ...defaultStyle,
      borderWidth: 1,
      borderStyle: "solid",
      backgroundColor: "transparent",
    },
  },
  {
    key: "graph1",
    value: "",
    style: defaultStyle,
  },
];

const GraphPanel = () => {
	const addComponent = useEditStore(state => state.addComponent);
	const setDraggedComponent = useDraggedStore(state => state.setDraggedComponent);
  return (
    <div >
      <ul className={styles.panel}>
        {settings.map((item) => (
          <li
            draggable={true}
            key={item.key}
            onClick={() => addComponent({...item, type: "Graph", key: uuidv4()})}
            onDragStart={() => {
									setDraggedComponent({
										...item,
										type: "Graph", 
										key: uuidv4()
									})
            }}
            style={{
              width: item.style.width,
              height: item.style.height,
              backgroundColor: item.style.backgroundColor,
              borderStyle: item.style.borderStyle,
              borderColor: item.style.borderColor,
            }}
						onDragEnd={
							() => {
								setDraggedComponent(null)
							}
						}
					></li>
        ))}
      </ul>
    </div>
  );
};

export default GraphPanel;

