import { Layout } from "antd";
import classNames from 'classnames';
import styles from './index.module.less'

const { Sider } = Layout;

const RightSider = () => {
	return (
		<Sider 
			className={classNames(styles.sider)}
			style={{backgroundColor: '#F5F5F5'}}
		>
			RightSider
		</Sider>
	)
}

export default RightSider;
