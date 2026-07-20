import { Layout } from 'antd';
import Canvas from './Canvas';

const { Content } = Layout;


const Center = () => {
	return (
		<Content style={{ position: 'relative' }}>
			<Canvas />
		</Content>
	)
};

export default Center;
