import { Layout } from "antd"
import Center from "./Center"
import LeftSider from "./LeftSider"
import RightSider from "./RightSider"
import styles from './index.module.less'

const EditPage: React.FC = () => {
	
	return (
		<Layout className={styles.main}>
			<LeftSider />
			<Center />
			<RightSider />
		</Layout>
	)
}

export default EditPage
