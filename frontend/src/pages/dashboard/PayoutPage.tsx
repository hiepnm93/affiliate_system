import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Card } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { Icon } from '@/components/icon';
import { cn } from '@/utils';
import payoutService from '@/api/services/payoutService';
import affiliateService from '@/api/services/affiliateService';
import type { PaymentMethod, RequestPayoutDto } from '@/types/affiliate';
import { format } from 'date-fns';
import { toast } from 'sonner';

const paymentMethods: { value: PaymentMethod; label: string; icon: string }[] = [
  {
    value: 'bank_transfer' as PaymentMethod,
    label: 'Bank Transfer',
    icon: 'solar:card-transfer-bold-duotone',
  },
  {
    value: 'e_wallet' as PaymentMethod,
    label: 'E-Wallet',
    icon: 'solar:wallet-bold-duotone',
  },
  {
    value: 'paypal' as PaymentMethod,
    label: 'PayPal',
    icon: 'simple-icons:paypal',
  },
  {
    value: 'crypto' as PaymentMethod,
    label: 'Cryptocurrency',
    icon: 'solar:bitcoin-bold-duotone',
  },
];

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

export default function PayoutPage() {
  const queryClient = useQueryClient();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('bank_transfer' as PaymentMethod);

  // Fetch stats for available balance
  const { data: stats } = useQuery({
    queryKey: ['affiliateStats'],
    queryFn: () => affiliateService.getStats(),
  });

  // Fetch payout history
  const { data: payouts = [], isLoading } = useQuery({
    queryKey: ['payouts'],
    queryFn: payoutService.getMyPayouts,
  });

  // Request payout mutation
  const requestPayoutMutation = useMutation({
    mutationFn: payoutService.requestPayout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payouts'] });
      queryClient.invalidateQueries({ queryKey: ['affiliateStats'] });
      toast.success('Payout request submitted successfully!');
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to request payout');
    },
  });

  const form = useForm<RequestPayoutDto>({
    defaultValues: {
      amount: 0,
      paymentMethod: 'bank_transfer' as PaymentMethod,
      paymentDetails: '',
    },
  });

  const onSubmit = async (data: RequestPayoutDto) => {
    const amount = Number(data.amount);

    if (amount < 50) {
      toast.error('Minimum payout amount is $50');
      return;
    }

    if (amount > (stats?.availableBalance || 0)) {
      toast.error('Insufficient balance');
      return;
    }

    await requestPayoutMutation.mutateAsync({
      ...data,
      amount,
      paymentMethod: selectedMethod,
    });
  };

  const availableBalance = (stats?.availableBalance ?? 0);
  const canRequestPayout = availableBalance >= 50;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payout Requests</h1>
        <p className="mt-1 text-gray-600">Request withdrawals and view your payout history</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Request Payout Form */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <Icon
                  icon="solar:dollar-minimalistic-bold-duotone"
                  className="h-6 w-6 text-primary-600"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Request Payout</h2>
                <p className="text-sm text-gray-600">Withdraw your earnings</p>
              </div>
            </div>

            {/* Available Balance */}
            <div className="mb-6 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 p-4">
              <p className="text-sm font-medium text-gray-600">Available Balance</p>
              <h3 className="mt-1 text-3xl font-bold text-primary-600">
                ${availableBalance.toFixed(2)}
              </h3>
              {!canRequestPayout && (
                <p className="mt-2 text-xs text-gray-600">
                  Minimum payout: $50.00
                </p>
              )}
            </div>

            {canRequestPayout ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    rules={{
                      required: 'Amount is required',
                      min: { value: 50, message: 'Minimum amount is $50' },
                      max: {
                        value: availableBalance,
                        message: 'Insufficient balance',
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="50"
                            max={availableBalance}
                            placeholder="50.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Payment Method Selection */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.value}
                          type="button"
                          onClick={() => setSelectedMethod(method.value)}
                          className={cn(
                            'flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all',
                            selectedMethod === method.value
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300',
                          )}
                        >
                          <Icon icon={method.icon} className="h-6 w-6" />
                          <span className="text-xs font-medium">{method.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="paymentDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Details</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={
                              selectedMethod === 'bank_transfer'
                                ? 'Account number'
                                : selectedMethod === 'paypal'
                                  ? 'PayPal email'
                                  : 'Wallet address'
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={requestPayoutMutation.isPending}
                  >
                    {requestPayoutMutation.isPending && (
                      <Icon icon="eos-icons:loading" className="mr-2 h-4 w-4" />
                    )}
                    Request Payout
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                <Icon
                  icon="solar:wallet-money-bold-duotone"
                  className="mx-auto mb-3 h-12 w-12 text-gray-400"
                />
                <p className="text-sm font-medium text-gray-600">
                  Keep earning to reach minimum payout
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  ${(50 - availableBalance).toFixed(2)} more to go
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Payout History */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Payout History</h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Icon icon="eos-icons:loading" className="h-8 w-8 text-primary-600" />
              </div>
            ) : payouts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Icon icon="solar:document-text-bold-duotone" className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No payouts yet</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Your payout requests will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {payouts.map((payout) => {
                  const config = statusConfig[payout.status];
                  return (
                    <div
                      key={payout.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                          <Icon
                            icon="solar:dollar-minimalistic-bold"
                            className="h-6 w-6 text-primary-600"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            ${payout.amount.toFixed(2)}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {format(new Date(payout.requestedAt), 'MMM dd, yyyy')}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {payout.paymentMethod.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium',
                            config.color,
                          )}
                        >
                          <Icon icon={config.icon} className="h-3 w-3" />
                          {config.label}
                        </span>
                        {payout.processedAt && (
                          <p className="mt-1 text-xs text-gray-500">
                            Processed: {format(new Date(payout.processedAt), 'MMM dd, yyyy')}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
