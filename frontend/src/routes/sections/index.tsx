import { Navigate, type RouteObject } from "react-router";
import { authRoutes } from "./auth";
import { dashboardRoutes } from "./dashboard";
import { mainRoutes } from "./main";

export const routesSection: RouteObject[] = [
	// Main routes (landing page, error pages) - must come first to match "/"
	...mainRoutes,
	// Auth
	...authRoutes,
	// Dashboard
	...dashboardRoutes,
	// No Match
	{ path: "*", element: <Navigate to="/404" replace /> },
];
