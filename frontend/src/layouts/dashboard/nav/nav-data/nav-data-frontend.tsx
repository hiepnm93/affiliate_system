import { Icon } from "@/components/icon";
import type { NavProps } from "@/components/nav";

export const frontendNavData: NavProps["data"] = [
	{
		name: "Affiliate System",
		items: [
			{
				title: "Dashboard",
				path: "/affiliate",
				icon: <Icon icon="solar:graph-bold-duotone" size="24" />,
			},
			{
				title: "Payouts",
				path: "/affiliate/payouts",
				icon: <Icon icon="solar:wallet-money-bold-duotone" size="24" />,
			},
		],
	},
	{
		name: "Admin",
		items: [
			{
				title: "Campaigns",
				path: "/admin/campaigns",
				icon: <Icon icon="solar:chart-bold-duotone" size="24" />,
			},
			{
				title: "Commissions",
				path: "/admin/commissions",
				icon: <Icon icon="solar:dollar-bold-duotone" size="24" />,
			},
			{
				title: "Payouts",
				path: "/admin/payouts",
				icon: <Icon icon="solar:card-transfer-bold-duotone" size="24" />,
			},
			{
				title: "Reports",
				path: "/admin/reports",
				icon: <Icon icon="solar:document-bold-duotone" size="24" />,
			},
		],
	},
];
