import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/ui/card';
import { Button } from '@/ui/button';
import { Iconify } from '@/components/icon';
import { ReferralCodeCard, StatsCard, CommissionTable } from '@/components/affiliate';
import affiliateService from '@/api/services/affiliateService';
import commissionService from '@/api/services/commissionService';
import { toast } from 'sonner';

export default function AffiliateDashboard() {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // Fetch referral code
  const { data: referralData, isLoading: isLoadingCode } = useQuery({
    queryKey: ['referralCode'],
    queryFn: affiliateService.getReferralCode,
  });

  // Fetch stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['affiliateStats', dateRange],
    queryFn: () => affiliateService.getStats(),
  });

  // Fetch commissions
  const { data: commissions = [], isLoading: isLoadingCommissions } = useQuery({
    queryKey: ['commissions'],
    queryFn: () => commissionService.getMyCommissions(),
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Affiliate Dashboard</h1>
          <p className="mt-1 text-gray-600">Track your performance and earnings</p>
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

      {/* Referral Code Card */}
      {isLoadingCode ? (
        <Card className="flex items-center justify-center p-12">
          <Iconify icon="eos-icons:loading" className="h-8 w-8 text-primary-600" />
        </Card>
      ) : referralData ? (
        <ReferralCodeCard
          referralCode={referralData.referralCode}
          shareableLink={referralData.shareableLink}
        />
      ) : null}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Clicks"
          value={stats?.totalClicks || 0}
          icon="solar:mouse-circle-bold-duotone"
          description="People who clicked your link"
          colorClass="bg-blue-100 text-blue-600"
        />
        <StatsCard
          title="Total Signups"
          value={stats?.totalSignups || 0}
          icon="solar:user-plus-bold-duotone"
          description="Successful registrations"
          colorClass="bg-green-100 text-green-600"
        />
        <StatsCard
          title="Total Conversions"
          value={stats?.totalConversions || 0}
          icon="solar:cart-check-bold-duotone"
          description="Paid transactions"
          colorClass="bg-purple-100 text-purple-600"
        />
        <StatsCard
          title="Total Earnings"
          value={`$${(stats?.totalCommissions || 0).toFixed(2)}`}
          icon="solar:dollar-minimalistic-bold-duotone"
          description="All-time commissions"
          colorClass="bg-amber-100 text-amber-600"
        />
      </div>

      {/* Commission Breakdown */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <h3 className="mt-2 text-2xl font-bold text-yellow-600">
                ${(stats?.pendingCommissions || 0).toFixed(2)}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
              <Iconify icon="solar:clock-circle-bold" className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <h3 className="mt-2 text-2xl font-bold text-green-600">
                ${(stats?.approvedCommissions || 0).toFixed(2)}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Iconify icon="solar:check-circle-bold" className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <h3 className="mt-2 text-2xl font-bold text-blue-600">
                ${(stats?.paidCommissions || 0).toFixed(2)}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Iconify icon="solar:wallet-money-bold" className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Balance</p>
              <h3 className="mt-2 text-2xl font-bold text-primary-600">
                ${(stats?.availableBalance || 0).toFixed(2)}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
              <Iconify
                icon="solar:dollar-minimalistic-bold-duotone"
                className="h-6 w-6 text-primary-600"
              />
            </div>
          </div>
          {(stats?.availableBalance || 0) >= 50 && (
            <Button className="mt-4 w-full" size="sm">
              Request Payout
            </Button>
          )}
        </Card>
      </div>

      {/* Recent Commissions */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recent Commissions</h2>
          <Button variant="outline" size="sm">
            <Iconify icon="solar:download-linear" className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
        <CommissionTable commissions={commissions.slice(0, 10)} isLoading={isLoadingCommissions} />
      </div>

      {/* Conversion Rate Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
            <p className="mt-1 text-sm text-gray-600">Your conversion funnel</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-blue-600">
              {stats?.totalClicks || 0}
            </div>
            <div className="text-sm text-gray-600">Clicks</div>
          </div>
          <div className="text-center">
            <Iconify icon="solar:arrow-right-linear" className="mx-auto mb-2 h-6 w-6 text-gray-400" />
            <div className="text-3xl font-bold text-green-600">{stats?.totalSignups || 0}</div>
            <div className="text-sm text-gray-600">Signups</div>
            {stats?.totalClicks ? (
              <div className="mt-1 text-xs text-gray-500">
                {((stats.totalSignups / stats.totalClicks) * 100).toFixed(1)}% conversion
              </div>
            ) : null}
          </div>
          <div className="text-center">
            <Iconify icon="solar:arrow-right-linear" className="mx-auto mb-2 h-6 w-6 text-gray-400" />
            <div className="text-3xl font-bold text-purple-600">
              {stats?.totalConversions || 0}
            </div>
            <div className="text-sm text-gray-600">Conversions</div>
            {stats?.totalSignups ? (
              <div className="mt-1 text-xs text-gray-500">
                {((stats.totalConversions / stats.totalSignups) * 100).toFixed(1)}% conversion
              </div>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  );
}
