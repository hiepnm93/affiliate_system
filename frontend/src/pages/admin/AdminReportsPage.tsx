import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/ui/card';
import { Button } from '@/ui/button';
import { Icon } from '@/components/icon';
import reportsService from '@/api/services/reportsService';

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const { data: reports, isLoading } = useQuery({
    queryKey: ['systemReports', dateRange],
    queryFn: () => reportsService.getSystemReports(),
  });

  const stats = [
    {
      title: 'Total Affiliates',
      value: reports?.overview.totalAffiliates || 0,
      icon: 'solar:users-group-rounded-bold-duotone',
      color: 'bg-blue-100 text-blue-600',
      change: '+12% from last month',
    },
    {
      title: 'Total Referrals',
      value: reports?.overview.totalReferrals || 0,
      icon: 'solar:user-plus-bold-duotone',
      color: 'bg-green-100 text-green-600',
      change: '+8% from last month',
    },
    {
      title: 'Total Commissions',
      value: `$${(reports?.overview.totalCommissions || 0).toFixed(2)}`,
      icon: 'solar:dollar-minimalistic-bold-duotone',
      color: 'bg-amber-100 text-amber-600',
      change: '+15% from last month',
    },
    {
      title: 'Total Paid Out',
      value: `$${(reports?.overview.totalPaid || 0).toFixed(2)}`,
      icon: 'solar:wallet-money-bold-duotone',
      color: 'bg-purple-100 text-purple-600',
      change: '+10% from last month',
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Reports</h1>
          <p className="mt-1 text-gray-600">Overview of your affiliate system performance</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', 'all'] as const).map((range) => (
            <Button
              key={range}
              variant={dateRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange(range)}
            >
              {range === 'all' ? 'All Time' : range.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Card className="flex items-center justify-center p-12">
          <Icon icon="eos-icons:loading" className="h-8 w-8 text-primary-600" />
        </Card>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <h3 className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</h3>
                    <p className="mt-2 text-xs text-green-600">{stat.change}</p>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.color}`}
                  >
                    <Icon icon={stat.icon} className="h-6 w-6" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Conversion Rate */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Conversion Funnel</h2>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {reports?.overview.totalReferrals || 0}
                </div>
                <div className="mt-1 text-sm text-gray-600">Referrals</div>
              </div>
              <Icon icon="solar:arrow-right-linear" className="h-6 w-6 text-gray-400" />
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">
                  {((reports?.overview.conversionRate || 0) * 100).toFixed(1)}%
                </div>
                <div className="mt-1 text-sm text-gray-600">Conversion Rate</div>
              </div>
              <Icon icon="solar:arrow-right-linear" className="h-6 w-6 text-gray-400" />
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  ${(reports?.overview.totalCommissions || 0).toFixed(2)}
                </div>
                <div className="mt-1 text-sm text-gray-600">Commissions</div>
              </div>
            </div>
          </Card>

          {/* Commission Breakdown */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Commission Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                      <Icon icon="solar:clock-circle-bold" className="h-5 w-5 text-yellow-600" />
                    </div>
                    <span className="font-medium text-gray-700">Pending</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">
                    {reports?.commissions.pending || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <Icon icon="solar:check-circle-bold" className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-700">Approved</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">
                    {reports?.commissions.approved || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <Icon
                        icon="solar:wallet-money-bold"
                        className="h-5 w-5 text-blue-600"
                      />
                    </div>
                    <span className="font-medium text-gray-700">Paid</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">
                    {reports?.commissions.paid || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                      <Icon icon="solar:close-circle-bold" className="h-5 w-5 text-red-600" />
                    </div>
                    <span className="font-medium text-gray-700">Rejected</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">
                    {reports?.commissions.rejected || 0}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Payout Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                      <Icon icon="solar:clock-circle-bold" className="h-5 w-5 text-yellow-600" />
                    </div>
                    <span className="font-medium text-gray-700">Pending</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">
                    {reports?.payouts.pending || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <Icon icon="solar:refresh-bold" className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-700">Processing</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">
                    {reports?.payouts.processing || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <Icon icon="solar:check-circle-bold" className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-700">Paid</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">
                    {reports?.payouts.paid || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                      <Icon icon="solar:close-circle-bold" className="h-5 w-5 text-red-600" />
                    </div>
                    <span className="font-medium text-gray-700">Failed</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">
                    {reports?.payouts.failed || 0}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Export Actions */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Export Reports</h2>
            <div className="flex gap-3">
              <Button variant="outline">
                <Icon icon="solar:download-linear" className="mr-2 h-5 w-5" />
                Export to CSV
              </Button>
              <Button variant="outline">
                <Icon icon="solar:file-text-bold" className="mr-2 h-5 w-5" />
                Export to PDF
              </Button>
              <Button variant="outline">
                <Icon icon="solar:chart-2-bold" className="mr-2 h-5 w-5" />
                Generate Full Report
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
