import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Icon } from '@/components/icon';
import { cn } from '@/utils';
import payoutService from '@/api/services/payoutService';
import type { PayoutStatus } from '@/types/affiliate';
import { format } from 'date-fns';
import { toast } from 'sonner';

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'solar:clock-circle-bold',
  },
  processing: {
    label: 'Processing',
    color: 'bg-blue-100 text-blue-800',
    icon: 'solar:refresh-bold',
  },
  paid: {
    label: 'Paid',
    color: 'bg-green-100 text-green-800',
    icon: 'solar:check-circle-bold',
  },
  failed: {
    label: 'Failed',
    color: 'bg-red-100 text-red-800',
    icon: 'solar:close-circle-bold',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-gray-100 text-gray-800',
    icon: 'solar:minus-circle-bold',
  },
};

export default function AdminPayoutPage() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<PayoutStatus | 'all'>('pending' as PayoutStatus);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const { data: payouts = [], isLoading } = useQuery({
    queryKey: ['allPayouts', selectedStatus],
    queryFn: () =>
      payoutService.getAllPayouts(selectedStatus === 'all' ? undefined : selectedStatus),
  });

  const processPayoutMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: number; status: 'paid' | 'failed'; notes?: string }) =>
      payoutService.processPayout(id, { status, adminNotes: notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPayouts'] });
      toast.success('Payout processed successfully!');
      setProcessingId(null);
      setAdminNotes('');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to process payout');
    },
  });

  const handleProcess = async (id: number, status: 'paid' | 'failed') => {
    await processPayoutMutation.mutateAsync({ id, status, notes: adminNotes || undefined });
  };

  const totalPending = payouts.filter((p) => p.status === 'pending').length;
  const totalAmount = payouts.reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = payouts
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payout Management</h1>
        <p className="mt-1 text-gray-600">Process affiliate payout requests</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">{payouts.length}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Icon icon="solar:document-text-bold-duotone" className="h-6 w-6 text-blue-600" />
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
              <Icon icon="solar:clock-circle-bold" className="h-6 w-6 text-yellow-600" />
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
              <Icon
                icon="solar:dollar-minimalistic-bold-duotone"
                className="h-6 w-6 text-primary-600"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <h3 className="mt-2 text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Icon icon="solar:check-circle-bold" className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          {(['all', 'pending', 'processing', 'paid', 'failed'] as const).map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus(status as PayoutStatus | 'all')}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </Card>

      {/* Payouts List */}
      {isLoading ? (
        <Card className="flex items-center justify-center p-12">
          <Icon icon="eos-icons:loading" className="h-8 w-8 text-primary-600" />
        </Card>
      ) : payouts.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Icon icon="solar:document-text-bold-duotone" className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No payout requests found</h3>
          <p className="mt-2 text-sm text-gray-600">
            {selectedStatus === 'pending'
              ? 'All payout requests have been processed'
              : 'Change filters to see other requests'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {payouts.map((payout) => {
            const config = statusConfig[payout.status];
            const isProcessing = processingId === payout.id;

            return (
              <Card key={payout.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                      <Icon
                        icon="solar:dollar-minimalistic-bold-duotone"
                        className="h-6 w-6 text-primary-600"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          ${payout.amount.toFixed(2)}
                        </h3>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium',
                            config.color,
                          )}
                        >
                          <Icon icon={config.icon} className="h-3 w-3" />
                          {config.label}
                        </span>
                      </div>
                      <div className="mt-2 grid gap-2 text-sm text-gray-600 md:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <Icon icon="solar:user-bold" className="h-4 w-4" />
                          <span>Affiliate #{payout.affiliateId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon icon="solar:calendar-bold" className="h-4 w-4" />
                          <span>
                            Requested: {format(new Date(payout.requestedAt), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon icon="solar:wallet-bold" className="h-4 w-4" />
                          <span className="capitalize">{payout.paymentMethod.replace('_', ' ')}</span>
                        </div>
                        {payout.processedAt && (
                          <div className="flex items-center gap-2">
                            <Icon icon="solar:check-read-bold" className="h-4 w-4" />
                            <span>
                              Processed: {format(new Date(payout.processedAt), 'MMM dd, yyyy')}
                            </span>
                          </div>
                        )}
                      </div>
                      {payout.paymentDetails && (
                        <div className="mt-2 rounded-lg bg-gray-50 p-3">
                          <p className="text-xs font-medium text-gray-500">Payment Details</p>
                          <p className="mt-1 font-mono text-sm text-gray-900">
                            {payout.paymentDetails}
                          </p>
                        </div>
                      )}
                      {payout.adminNotes && (
                        <div className="mt-2 rounded-lg bg-blue-50 p-3">
                          <p className="text-xs font-medium text-blue-600">Admin Notes</p>
                          <p className="mt-1 text-sm text-gray-900">{payout.adminNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    {payout.status === 'pending' && !isProcessing && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => setProcessingId(payout.id)}
                        >
                          Process
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Processing Form */}
                {isProcessing && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Admin Notes (Optional)
                    </label>
                    <Input
                      placeholder="Add notes about this payout..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="mb-4"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleProcess(payout.id, 'paid')}
                        disabled={processPayoutMutation.isPending}
                      >
                        <Icon icon="solar:check-circle-bold" className="mr-2 h-4 w-4" />
                        Mark as Paid
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleProcess(payout.id, 'failed')}
                        disabled={processPayoutMutation.isPending}
                      >
                        <Icon icon="solar:close-circle-bold" className="mr-2 h-4 w-4" />
                        Mark as Failed
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setProcessingId(null);
                          setAdminNotes('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
