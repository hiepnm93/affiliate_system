import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Icon } from '@/components/icon';
import { Input } from '@/ui/input';
import affiliateService from '@/api/services/affiliateService';
import apiClient from '@/api/apiClient';
import { m } from 'motion/react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useUserActions } from '@/store/userStore';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  referralCode?: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [registrationType, setRegistrationType] = useState<'customer' | 'affiliate'>('customer');
  const { setUserToken, setUserInfo } = useUserActions();

  const form = useForm<RegisterFormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      referralCode: '',
    },
  });

  useEffect(() => {
    // Get registration type from URL
    const type = searchParams.get('type');
    if (type === 'affiliate') {
      setRegistrationType('affiliate');
    }

    // Get referral code from URL or sessionStorage
    const refCode =
      searchParams.get('ref') ||
      searchParams.get('referralCode') ||
      sessionStorage.getItem('referralCode') ||
      '';

    if (refCode) {
      form.setValue('referralCode', refCode);
    }
  }, [searchParams, form]);

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      if (registrationType === 'affiliate') {
        // Register as affiliate
        const response = await affiliateService.registerAsAffiliate({
          email: data.email,
          password: data.password,
          referralCode: data.referralCode || undefined,
        });

        // Set token and user info
        setUserToken({ accessToken: response.token, refreshToken: '' });
        setUserInfo({
          id: response.affiliate.userId,
          email: data.email,
          roles: ['affiliate'],
        } as any);

        toast.success('Successfully registered as affiliate!');
        navigate('/affiliate');
      } else {
        // Register as customer
        const response = await apiClient.post<{ user: any; token: string }>({
          url: '/auth/register/customer',
          data: {
            email: data.email,
            password: data.password,
            referralCode: data.referralCode || undefined,
          },
        });

        setUserToken({ accessToken: response.token, refreshToken: '' });
        setUserInfo(response.user);

        toast.success('Successfully registered! Welcome voucher has been sent to your email.');
        navigate('/dashboard');
      }

      // Clear referral code from session storage
      sessionStorage.removeItem('referralCode');
    } catch (error: any) {
      toast.error(error?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4 py-12">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="mb-8 text-center">
            <div
              className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                registrationType === 'affiliate' ? 'bg-secondary-100' : 'bg-primary-100'
              }`}
            >
              <Icon
                icon={
                  registrationType === 'affiliate'
                    ? 'solar:dollar-minimalistic-bold-duotone'
                    : 'solar:user-plus-bold-duotone'
                }
                className={`h-8 w-8 ${
                  registrationType === 'affiliate' ? 'text-secondary-600' : 'text-primary-600'
                }`}
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {registrationType === 'affiliate' ? 'Join as Affiliate' : 'Sign Up as Customer'}
            </h1>
            <p className="mt-2 text-gray-600">
              {registrationType === 'affiliate'
                ? 'Start earning commissions by referring new customers'
                : 'Create your account and get exclusive rewards'}
            </p>
          </div>

          {/* Registration Type Toggle */}
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setRegistrationType('customer')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                registrationType === 'customer'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setRegistrationType('affiliate')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                registrationType === 'affiliate'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Affiliate
            </button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                rules={{
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                rules={{
                  required: 'Please confirm your password',
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referralCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Referral Code{' '}
                      <span className="text-gray-500">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter referral code"
                        {...field}
                        className="font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Icon icon="eos-icons:loading" className="mr-2 h-4 w-4" />}
                {registrationType === 'affiliate' ? 'Join as Affiliate' : 'Create Account'}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Button
                variant="link"
                className="p-0 font-semibold text-primary-600"
                onClick={() => navigate('/auth/login')}
              >
                Sign in
              </Button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              className="text-sm text-gray-500"
              onClick={() => navigate('/')}
            >
              <Icon icon="solar:arrow-left-linear" className="mr-1 h-4 w-4" />
              Back to home
            </Button>
          </div>
        </Card>
      </m.div>
    </div>
  );
}
