import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Iconify } from '@/components/icon';
import { cn } from '@/utils';
import commissionService from '@/api/services/commissionService';
import type { Commission, CommissionStatus } from '@/types/affiliate';
import { format } from 'date-fns';
import { toast } from 'sonner';

const statusConfig = {
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

export default function CommissionApprovalPage() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<CommissionStatus | 'all'>('pending');
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectionNotes, setRejectionNotes] = useState('');

  const { data: commissions = [], isLoading } = useQuery({
    queryKey: ['allCommissions', selectedStatus],
    queryFn: () =>
      commissionService.getAllCommissions(
        selectedStatus === 'all' ? undefined : selectedStatus,
      ),
  });

  const approveMutation = useMutation({
    mutationFn: commissionService.approveCommission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allCommissions'] });
      toast.success('Commission approved successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to approve commission');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, notes }: { id: number; notes: string }) =>
      commissionService.rejectCommission(id, { rejectionNotes: notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allCommissions'] });
      toast.success('Commission rejected');
      setRejectingId(null);
      setRejectionNotes('');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to reject commission');
    },
  });

  const handleApprove = async (id: number) => {
    await approveMutation.mutateAsync(id);
  };

  const handleReject = async (id: number) => {
    if (!rejectionNotes.trim()) {
      toast.error('Please provide rejection notes');
      return;
    }
    await rejectMutation.mutateAsync({ id, notes: rejectionNotes });
  };

  const totalPending = commissions.filter((c) => c.status === 'pending').length;
  const totalAmount = commissions.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Commission Approval</h1>
        <p className="mt-1 text-gray-600">Review and approve pending commissions</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Commissions</p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">{commissions.length}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Iconify icon="solar:document-text-bold-duotone" className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <h3 className="mt-2 text-2xl font-bold text-yellow-600">{totalPending}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
              <Iconify icon="solar:clock-circle-bold" className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <h3 className="mt-2 text-2xl font-bold text-primary-600">
                ${totalAmount.toFixed(2)}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
              <Iconify
                icon="solar:dollar-minimalistic-bold-duotone"
                className="h-6 w-6 text-primary-600"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <h3 className="mt-2 text-2xl font-bold text-green-600">
                {commissions.filter((c) => c.status === 'approved').length}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Iconify icon="solar:check-circle-bold" className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          {(['all', 'pending', 'approved', 'rejected', 'paid'] as const).map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </Card>

      {/* Commissions List */}
      {isLoading ? (
        <Card className="flex items-center justify-center p-12">
          <Iconify icon="eos-icons:loading" className="h-8 w-8 text-primary-600" />
        </Card>
      ) : commissions.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Iconify icon="solar:document-text-bold-duotone" className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No commissions found</h3>
          <p className="mt-2 text-sm text-gray-600">
            {selectedStatus === 'pending'
              ? 'All commissions have been processed'
              : 'Change filters to see other commissions'}
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Affiliate
                  </th>
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {commissions.map((commission) => {
                  const config = statusConfig[commission.status];
                  const isRejecting = rejectingId === commission.id;

                  return (
                    <tr key={commission.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        #{commission.id}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                        Affiliate #{commission.affiliateId}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {format(new Date(commission.createdAt), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(commission.createdAt), 'hh:mm a')}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-600">
                          L{commission.level}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-lg font-semibold text-gray-900">
                        ${commission.amount.toFixed(2)}
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
                      <td className="whitespace-nowrap px-6 py-4">
                        {commission.status === 'pending' && !isRejecting && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleApprove(commission.id)}
                              disabled={approveMutation.isPending}
                            >
                              <Iconify icon="solar:check-circle-bold" className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setRejectingId(commission.id)}
                            >
                              <Iconify icon="solar:close-circle-bold" className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        )}
                        {isRejecting && (
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Rejection reason..."
                              value={rejectionNotes}
                              onChange={(e) => setRejectionNotes(e.target.value)}
                              className="w-48"
                              autoFocus
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(commission.id)}
                              disabled={rejectMutation.isPending}
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setRejectingId(null);
                                setRejectionNotes('');
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
