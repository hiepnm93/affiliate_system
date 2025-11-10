import "./global.css";
import "./theme/theme.css";
import "./locales/i18n";

import { Outlet, RouterProvider, createBrowserRouter } from "react-router";

import App from "./App";
import ErrorBoundary from "./routes/components/error-boundary";
import { GLOBAL_CONFIG } from "./global-config";
import ReactDOM from "react-dom/client";
import menuService from "./api/services/menuService";
import { registerLocalIcons } from "./components/icon";
import { routesSection } from "./routes/sections";

await registerLocalIcons();

if (GLOBAL_CONFIG.routerMode === "backend") {
	await menuService.getMenuList();
}

const router = createBrowserRouter(
	[
		{
			Component: () => (
				<App>
					<Outlet />
				</App>
			),
			errorElement: <ErrorBoundary />,
			children: routesSection,
		},
	],
	{
		basename: GLOBAL_CONFIG.publicPath,
	},
);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<RouterProvider router={router} />);
