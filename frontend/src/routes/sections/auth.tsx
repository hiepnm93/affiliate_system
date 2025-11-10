import { Suspense, lazy } from "react";
import { Outlet } from "react-router";
import type { RouteObject } from "react-router";

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));

const authCustom: RouteObject[] = [
	{
		path: "login",
		element: <LoginPage />,
	},
	{
		path: "register",
		element: <RegisterPage />,
	},
];

export const authRoutes: RouteObject[] = [
	{
		path: "auth",
		element: (
			<Suspense>
				<Outlet />
			</Suspense>
		),
		children: [...authCustom],
	},
];
