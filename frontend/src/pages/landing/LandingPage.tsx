import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Icon } from '@/components/icon';

export default function LandingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [referralCode, setReferralCode] = useState<string>('');

  useEffect(() => {
    // Get referral code from URL
    const refCode = searchParams.get('ref') || searchParams.get('referralCode');
    if (refCode) {
      setReferralCode(refCode);
      // Store in sessionStorage for use during registration
      sessionStorage.setItem('referralCode', refCode);

      // Track click event
      trackReferralClick(refCode);
    }
  }, [searchParams]);

  const trackReferralClick = async (refCode: string) => {
    try {
      // Send tracking request to backend
      await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/affiliate/track/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralCode: refCode }),
      });
    } catch (error) {
      console.error('Failed to track referral click:', error);
    }
  };

  const handleSignupAsCustomer = () => {
    navigate(`/auth/register?type=customer&ref=${referralCode}`);
  };

  const handleJoinAsAffiliate = () => {
    navigate(`/auth/register?type=affiliate&ref=${referralCode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon icon="solar:crown-star-bold-duotone" className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">Affiliate System</span>
            </div>
            <Button variant="ghost" onClick={() => navigate('/auth/login')}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Welcome to</span>
              <span className="block text-primary-600">Our Affiliate Program</span>
            </h1>
            {referralCode && (
              <p className="mx-auto mt-4 max-w-md text-lg text-gray-600">
                You've been invited with code:{' '}
                <span className="font-mono font-semibold text-primary-600">{referralCode}</span>
              </p>
            )}
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-500">
              Join thousands of satisfied users and start earning rewards today
            </p>
          </motion.div>

          {/* Dual Flow Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 grid gap-8 md:grid-cols-2"
          >
            {/* Customer Signup Card */}
            <Card className="overflow-hidden border-2 border-transparent transition-all hover:border-primary-200 hover:shadow-xl">
              <div className="p-8">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                  <Icon
                    icon="solar:user-star-bold-duotone"
                    className="h-8 w-8 text-primary-600"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Sign Up as Customer</h2>
                <p className="mt-4 text-gray-600">
                  Create an account and start using our services. Get exclusive vouchers and
                  rewards with your registration!
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <Icon icon="solar:check-circle-bold" className="mt-1 h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Special welcome voucher</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon icon="solar:check-circle-bold" className="mt-1 h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Access to all premium features</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon icon="solar:check-circle-bold" className="mt-1 h-5 w-5 text-green-600" />
                    <span className="text-gray-700">24/7 customer support</span>
                  </div>
                </div>

                <Button
                  onClick={handleSignupAsCustomer}
                  className="mt-8 w-full"
                  size="lg"
                >
                  Get Started
                  <Icon icon="solar:arrow-right-linear" className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </Card>

            {/* Affiliate Signup Card */}
            <Card className="overflow-hidden border-2 border-transparent transition-all hover:border-secondary-200 hover:shadow-xl">
              <div className="p-8">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary-100">
                  <Icon
                    icon="solar:dollar-minimalistic-bold-duotone"
                    className="h-8 w-8 text-secondary-600"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Join as Affiliate</h2>
                <p className="mt-4 text-gray-600">
                  Become an affiliate partner and earn commissions by referring new customers.
                  Build your network and earn passive income!
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <Icon icon="solar:check-circle-bold" className="mt-1 h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Multi-level commission structure</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon icon="solar:check-circle-bold" className="mt-1 h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Real-time performance tracking</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon icon="solar:check-circle-bold" className="mt-1 h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Fast payout processing</span>
                  </div>
                </div>

                <Button
                  onClick={handleJoinAsAffiliate}
                  className="mt-8 w-full"
                  size="lg"
                  variant="outline"
                >
                  Become an Affiliate
                  <Icon icon="solar:arrow-right-linear" className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-24"
          >
            <h2 className="text-center text-3xl font-bold text-gray-900">Why Choose Us?</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Icon icon="solar:shield-check-bold-duotone" className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Secure & Reliable</h3>
                <p className="mt-2 text-gray-600">
                  Your data is protected with enterprise-grade security
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                  <Icon icon="solar:graph-up-bold-duotone" className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Grow Your Income</h3>
                <p className="mt-2 text-gray-600">
                  Earn passive income through our multi-level affiliate program
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Icon icon="solar:chart-square-bold-duotone" className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Real-time Analytics</h3>
                <p className="mt-2 text-gray-600">
                  Track your performance with detailed analytics and reports
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-gray-200 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            © 2025 Affiliate System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
