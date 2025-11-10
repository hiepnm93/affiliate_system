import { Icon } from "@/components/icon";
import type { NavProps } from "@/components/nav";

export const frontendNavData: NavProps["data"] = [
	{
		name: "sys.nav.affiliate_system",
		items: [
			{
				title: "sys.nav.dashboard",
				path: "/affiliate",
				icon: <Icon icon="solar:graph-bold-duotone" size="24" />,
			},
			{
				title: "sys.nav.payouts",
				path: "/affiliate/payouts",
				icon: <Icon icon="solar:wallet-money-bold-duotone" size="24" />,
			},
		],
	},
	{
		name: "sys.nav.admin",
		items: [
			{
				title: "sys.nav.campaigns",
				path: "/admin/campaigns",
				icon: <Icon icon="solar:chart-bold-duotone" size="24" />,
			},
			{
				title: "sys.nav.commissions",
				path: "/admin/commissions",
				icon: <Icon icon="solar:dollar-bold-duotone" size="24" />,
			},
			{
				title: "sys.nav.payouts",
				path: "/admin/payouts",
				icon: <Icon icon="solar:card-transfer-bold-duotone" size="24" />,
			},
			{
				title: "sys.nav.reports",
				path: "/admin/reports",
				icon: <Icon icon="solar:document-bold-duotone" size="24" />,
			},
		],
	},
];
