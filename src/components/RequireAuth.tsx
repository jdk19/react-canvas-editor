import { Outlet } from "react-router";
import { Layout, Spin } from "antd";
import Login from "./Login.tsx";
import useLoadingStore from "src/store/LodingStore.ts";
import styles from './RequireAuth.module.less'

const RequireAuth : React.FC = () => {
	const isLoading = useLoadingStore(state => state.isLoading);
  const headerStyle: React.CSSProperties = {
    textAlign: "center",
    color: "#fff",
    height: 64,
    paddingInline: 10,
    lineHeight: "64px",
    backgroundColor: "#3C3C3C",
  };
	return (
		<Layout style={{ height: "100%" }}>
			{ isLoading &&
				<div className={styles.loading}>
					<Spin size="large">
					</Spin>
				</div>
			}
			<Layout.Header style={headerStyle}>
				<Login />
			</Layout.Header>
			<Outlet />
		</Layout>
	);
};

export default RequireAuth;
