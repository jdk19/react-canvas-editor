import { Layout } from "antd"
import Center from "./Center"
import LeftSider from "./LeftSider"
import RightSider from "./RightSider"
import styles from './index.module.less'
import Header from "./Header"

const EditPage: React.FC = () => {
	
	return (
		<Layout className={styles.main}>
			<Header />
			
			<LeftSider />
			<Center />
			<RightSider />
		</Layout>
	)
}

export default EditPage
