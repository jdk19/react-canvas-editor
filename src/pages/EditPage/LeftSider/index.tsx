import { Layout } from 'antd';
import classNames from 'classnames';
import styles from './index.module.less'
import IconArea from './IconArea';
import FlyoutPanel from './FlyoutPanel';
import { useState } from 'react';
import type { ComponentType, IconItem } from './types';
import getSubItems from 'src/data/getSubItems';

const { Sider, Content } = Layout;

const items: IconItem[] = [
	{
		id: 'Text',
		name: 'wenben',
		title: '文本'	
	},
	{
		id: 'Graph',
		name: 'graphical',
		title: '图形'	
	},
	{
		id: 'Image',
		name: 'tupian',
		title: '图片'	
	},
]

const LeftSider = () => {
	const [selectedId, setSelectedId] = useState<ComponentType | null>(null);	
	const handleClick = (id: ComponentType) => {
		if(selectedId === id) {
			setSelectedId(null);
		} else {
			setSelectedId(id);
		}
	}
	return (
		<Sider 
			className={classNames(styles.sider)}
			style={{backgroundColor: '#F5F5F5'}}
			width={400}
		>
			<Layout style={{height: "100%"}}>
				<Sider width={80} style={{backgroundColor: "#FFFFFF"}}>
					<IconArea items={items} onClick={handleClick} selectedId={selectedId}/>
				</Sider>
				<Content>
					<FlyoutPanel items={getSubItems(selectedId)}/>
				</Content>
			</Layout>
		</Sider>
	)
}

export default LeftSider;
