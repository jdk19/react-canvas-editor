import { Outlet } from "react-router";
import { Layout } from "antd";
import Login from "./Login.tsx";

const RequireAuth : React.FC = () => {
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
			<Layout.Header style={headerStyle}>
				<Login />
			</Layout.Header>
			<Outlet />
		</Layout>
	);
};

export default RequireAuth;
