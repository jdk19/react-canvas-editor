import { createBrowserRouter } from "react-router";
import RequireAuth from "src/components/RequireAuth";
import EditPage from "src/pages/EditPage";
import ListPage from "src/pages/ListPage";

const router = createBrowserRouter([
	{
		path: '/',
		Component: RequireAuth,
		children: [
			{
				index: true,
				Component: EditPage,
			},
			{
				path: '/list',
				Component: ListPage,
			}
		]
	}
]);

export default router;
