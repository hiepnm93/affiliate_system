import { Card } from '@/ui/card';
import { Iconify } from '@/components/icon';
import { cn } from '@/utils';
import type { Commission, CommissionStatus } from '@/types/affiliate';
import { format } from 'date-fns';

interface CommissionTableProps {
  commissions: Commission[];
  isLoading?: boolean;
}

const statusConfig: Record<
  CommissionStatus,
  { label: string; color: string; icon: string }
> = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'solar:clock-circle-bold',
  },
  approved: {
    label: 'Approved',
    color: 'bg-green-100 text-green-800',
    icon: 'solar:check-circle-bold',
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800',
    icon: 'solar:close-circle-bold',
  },
  paid: {
    label: 'Paid',
    color: 'bg-blue-100 text-blue-800',
    icon: 'solar:dollar-minimalistic-bold',
  },
};

export function CommissionTable({ commissions, isLoading }: CommissionTableProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <Iconify icon="eos-icons:loading" className="h-8 w-8 text-primary-600" />
        </div>
      </Card>
    );
  }

  if (commissions.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Iconify icon="solar:document-text-bold-duotone" className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No commissions yet</h3>
          <p className="mt-2 text-sm text-gray-600">
            Start sharing your referral link to earn commissions
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Transaction
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {commissions.map((commission) => {
              const config = statusConfig[commission.status];
              return (
                <tr key={commission.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {format(new Date(commission.createdAt), 'MMM dd, yyyy')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(commission.createdAt), 'hh:mm a')}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                        <span className="text-xs font-bold text-primary-600">
                          L{commission.level}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">Level {commission.level}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-lg font-semibold text-gray-900">
                      ${commission.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium',
                        config.color,
                      )}
                    >
                      <Iconify icon={config.icon} className="h-3 w-3" />
                      {config.label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    #{commission.transactionId}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
