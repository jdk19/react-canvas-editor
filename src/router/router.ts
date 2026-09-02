import { createBrowserRouter } from "react-router";
import RequireAuth from "src/components/RequireAuth";

const router = createBrowserRouter([
	{
		path: '/',
		Component: RequireAuth,
		children: [
			{
				index: true,
				lazy: () => import("src/pages/EditPage").then((m) => ({ Component: m.default })),
			},
			{
				path: '/list',
				lazy: () => import("src/pages/ListPage").then((m) => ({ Component: m.default })),
			}
		]
	}
]);

export default router;
