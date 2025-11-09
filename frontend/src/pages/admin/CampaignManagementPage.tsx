import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Card } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { Iconify } from '@/components/icon';
import { cn } from '@/utils';
import campaignService from '@/api/services/campaignService';
import type { Campaign, CreateCampaignDto, RewardType } from '@/types/affiliate';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function CampaignManagementPage() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: campaignService.getAllCampaigns,
  });

  const createMutation = useMutation({
    mutationFn: campaignService.createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign created successfully!');
      setIsCreating(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create campaign');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      campaignService.updateCampaign(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign updated successfully!');
      setEditingCampaign(null);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update campaign');
    },
  });

  const form = useForm<CreateCampaignDto>({
    defaultValues: {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      rewardType: 'percentage',
      rewardValue: 0,
      multiLevelConfig: { 1: 10, 2: 5, 3: 2 },
      cookieTTLDays: 30,
    },
  });

  const onSubmit = async (data: CreateCampaignDto) => {
    if (editingCampaign) {
      await updateMutation.mutateAsync({ id: editingCampaign.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsCreating(true);
    form.reset({
      name: campaign.name,
      description: campaign.description || '',
      startDate: campaign.startDate.split('T')[0],
      endDate: campaign.endDate.split('T')[0],
      rewardType: campaign.rewardType,
      rewardValue: campaign.rewardValue,
      multiLevelConfig: campaign.multiLevelConfig,
      cookieTTLDays: campaign.cookieTTLDays,
    });
  };

  const handleCancelEdit = () => {
    setIsCreating(false);
    setEditingCampaign(null);
    form.reset();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaign Management</h1>
          <p className="mt-1 text-gray-600">Create and manage affiliate campaigns</p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>
            <Iconify icon="solar:add-circle-bold" className="mr-2 h-5 w-5" />
            Create Campaign
          </Button>
        )}
      </div>

      {/* Create/Edit Campaign Form */}
      {isCreating && (
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
            </h2>
            <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
              <Iconify icon="solar:close-circle-linear" className="h-5 w-5" />
            </Button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: 'Campaign name is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Summer Sale Campaign" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rewardType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reward Type</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2"
                        >
                          <option value="percentage">Percentage</option>
                          <option value="fixed">Fixed Amount</option>
                          <option value="voucher">Voucher</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  rules={{ required: 'Start date is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  rules={{ required: 'End date is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rewardValue"
                  rules={{
                    required: 'Reward value is required',
                    min: { value: 0, message: 'Must be positive' },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reward Value</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cookieTTLDays"
                  rules={{
                    required: 'Cookie TTL is required',
                    min: { value: 1, message: 'Must be at least 1 day' },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cookie TTL (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        rows={3}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2"
                        placeholder="Campaign description..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Multi-level Config */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Multi-Level Commission (%)
                </label>
                <div className="grid gap-4 md:grid-cols-3">
                  {[1, 2, 3].map((level) => (
                    <FormField
                      key={level}
                      control={form.control}
                      name={`multiLevelConfig.${level}` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Level {level}</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Iconify icon="eos-icons:loading" className="mr-2 h-4 w-4" />
                  )}
                  {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      )}

      {/* Campaigns List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <Card className="flex items-center justify-center p-12">
            <Iconify icon="eos-icons:loading" className="h-8 w-8 text-primary-600" />
          </Card>
        ) : campaigns.length === 0 ? (
          <Card className="col-span-full p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Iconify icon="solar:document-text-bold-duotone" className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No campaigns yet</h3>
            <p className="mt-2 text-sm text-gray-600">Create your first campaign to get started</p>
          </Card>
        ) : (
          campaigns.map((campaign) => (
            <Card key={campaign.id} className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                  <p className="mt-1 text-sm text-gray-600">{campaign.description}</p>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2 py-1 text-xs font-medium',
                    campaign.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800',
                  )}
                >
                  {campaign.status}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Iconify icon="solar:calendar-bold-duotone" className="h-4 w-4" />
                  <span>
                    {format(new Date(campaign.startDate), 'MMM dd')} -{' '}
                    {format(new Date(campaign.endDate), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Iconify icon="solar:tag-bold-duotone" className="h-4 w-4" />
                  <span className="capitalize">{campaign.rewardType}</span>
                  <span className="font-semibold">{campaign.rewardValue}%</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Iconify icon="solar:layers-bold-duotone" className="h-4 w-4" />
                  <span>
                    Levels: {Object.keys(campaign.multiLevelConfig).length}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(campaign)}>
                  <Iconify icon="solar:pen-bold" className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
