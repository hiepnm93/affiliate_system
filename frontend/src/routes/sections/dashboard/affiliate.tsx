import { Suspense, lazy } from "react";
import { Outlet } from "react-router";
import type { RouteObject } from "react-router";

// Lazy load pages
const AffiliateDashboard = lazy(() => import("@/pages/dashboard/AffiliateDashboard"));
const PayoutPage = lazy(() => import("@/pages/dashboard/PayoutPage"));
const CampaignManagementPage = lazy(() => import("@/pages/admin/CampaignManagementPage"));
const CommissionApprovalPage = lazy(() => import("@/pages/admin/CommissionApprovalPage"));
const AdminPayoutPage = lazy(() => import("@/pages/admin/AdminPayoutPage"));
const AdminReportsPage = lazy(() => import("@/pages/admin/AdminReportsPage"));

export const getAffiliateRoutes = (): RouteObject[] => [
	{
		path: "affiliate",
		element: (
			<Suspense fallback={<div>Loading...</div>}>
				<Outlet />
			</Suspense>
		),
		children: [
			{
				index: true,
				element: <AffiliateDashboard />,
			},
			{
				path: "payouts",
				element: <PayoutPage />,
			},
		],
	},
	{
		path: "admin",
		element: (
			<Suspense fallback={<div>Loading...</div>}>
				<Outlet />
			</Suspense>
		),
		children: [
			{
				path: "campaigns",
				element: <CampaignManagementPage />,
			},
			{
				path: "commissions",
				element: <CommissionApprovalPage />,
			},
			{
				path: "payouts",
				element: <AdminPayoutPage />,
			},
			{
				path: "reports",
				element: <AdminReportsPage />,
			},
		],
	},
];
